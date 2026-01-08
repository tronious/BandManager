const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  const validPassword = process.env.ADMIN_PASSWORD;
  
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

module.exports = router;
