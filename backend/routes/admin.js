const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

const PHOTOS_BUCKET = process.env.SUPABASE_PHOTOS_BUCKET || 'event-photos';

const supabaseConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

const isMissingTableError = (error) => {
  const msg = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();
  if (code === '42p01' || code === 'pgrst205') return true;
  if (msg.includes('event_photos') && msg.includes('does not exist')) return true;
  if (msg.includes('could not find the') && msg.includes('event_photos')) return true;
  if (msg.includes('relation') && msg.includes('event_photos') && msg.includes('does not exist')) return true;
  return false;
};

const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
};

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const adminPassword = String(req.headers['x-admin-password'] || '').trim();
  const validPassword = String(process.env.ADMIN_PIN || process.env.ADMIN_PASSWORD || '').trim();

  if (!validPassword || !adminPassword || adminPassword !== validPassword) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// Apply admin auth to all routes
router.use(adminAuth);

// Verify admin login
router.post('/login', (req, res) => {
  // If we get here, the password was correct (middleware passed)
  res.json({ success: true, message: 'Welcome, admin!' });
});

// Get all events from database
router.get('/events', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create a new event
router.post('/events', async (req, res) => {
  try {
    const { name, date, venue, description, ticket_url } = req.body;
    
    if (!name || !date) {
      return res.status(400).json({ error: 'Name and date are required' });
    }

    const { data, error } = await supabase
      .from('events')
      .insert([{ name, date, venue, description, ticket_url }])
      .select()
      .single();

    if (error) throw error;
    
    console.log(`Admin created new event: ${name}`);
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update an event
router.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, venue, description, ticket_url } = req.body;

    const { data, error } = await supabase
      .from('events')
      .update({ name, date, venue, description, ticket_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    console.log(`Admin updated event ${id}: ${name}`);
    res.json(data);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete an event
router.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    console.log(`Admin deleted event ${id}`);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// List photos for an event (DB-backed if event_photos exists, else Storage folder listing)
router.get('/events/:eventId/photos', async (req, res) => {
  try {
    if (!supabaseConfigured()) {
      return res.status(500).json({ error: 'Server not configured for photos (missing SUPABASE_URL / SUPABASE_SERVICE_KEY).' });
    }

    const { eventId } = req.params;
    if (!eventId) return res.status(400).json({ error: 'Missing eventId' });

    const { data, error } = await supabase
      .from('event_photos')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (!error) return res.json(Array.isArray(data) ? data : []);
    if (!isMissingTableError(error)) throw error;

    const { data: objects, error: listError } = await supabase.storage.from(PHOTOS_BUCKET).list(eventId, {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (listError) throw listError;

    const photos = (objects || [])
      .filter((o) => o && o.name && !o.name.endsWith('/'))
      .map((o) => {
        const storage_path = `${eventId}/${o.name}`;
        return {
          id: storage_path,
          event_id: eventId,
          storage_path,
          url: getPublicUrl(PHOTOS_BUCKET, storage_path),
          caption: null,
          created_at: o.created_at || o.updated_at || null,
        };
      })
      .filter((p) => p.url);

    return res.json(photos);
  } catch (err) {
    console.error('Error fetching admin event photos:', err);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Delete one photo for an event. Body can include { id } (DB id) and/or { storage_path }
router.delete('/events/:eventId/photos', async (req, res) => {
  try {
    if (!supabaseConfigured()) {
      return res.status(500).json({ error: 'Server not configured for photos (missing SUPABASE_URL / SUPABASE_SERVICE_KEY).' });
    }

    const { eventId } = req.params;
    const { id, storage_path } = req.body || {};

    if (!eventId) return res.status(400).json({ error: 'Missing eventId' });
    if (!id && !storage_path) return res.status(400).json({ error: 'Missing photo identifier' });

    let pathToDelete = storage_path;
    let photoRowId = id;

    // If we only have an id, try to look up the storage path.
    if (!pathToDelete && photoRowId) {
      const { data: row, error: lookupError } = await supabase
        .from('event_photos')
        .select('id, storage_path')
        .eq('id', photoRowId)
        .single();

      if (!lookupError && row?.storage_path) {
        pathToDelete = row.storage_path;
      } else if (lookupError && isMissingTableError(lookupError)) {
        // If there's no DB table, treat id as a storage path when it looks like one.
        if (String(photoRowId).includes('/')) {
          pathToDelete = photoRowId;
          photoRowId = null;
        }
      } else if (lookupError) {
        throw lookupError;
      }
    }

    if (!pathToDelete) return res.status(400).json({ error: 'Missing storage_path for photo' });

    const { error: removeError } = await supabase.storage.from(PHOTOS_BUCKET).remove([pathToDelete]);
    if (removeError) throw removeError;

    // Best-effort DB cleanup (ignore if table not present)
    if (photoRowId) {
      const { error: delError } = await supabase.from('event_photos').delete().eq('id', photoRowId);
      if (delError && !isMissingTableError(delError)) throw delError;
    } else {
      const { error: delByPathError } = await supabase
        .from('event_photos')
        .delete()
        .eq('event_id', eventId)
        .eq('storage_path', pathToDelete);
      if (delByPathError && !isMissingTableError(delByPathError)) throw delByPathError;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting admin event photo:', err);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

module.exports = router;
