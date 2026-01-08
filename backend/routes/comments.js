// routes/comments.js
// API routes for managing event comments
// These endpoints handle CRUD operations for comments on events

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// GET /api/comments/counts - Get comment counts for multiple events
router.get('/counts', async (req, res) => {
  try {
    const { eventIds } = req.query;
    
    if (!eventIds) {
      return res.status(400).json({ error: 'eventIds query parameter is required' });
    }
    
    const ids = eventIds.split(',');
    
    // Get counts for each event
    const counts = {};
    for (const id of ids) {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);
      
      if (error) {
        console.error(`Error fetching count for event ${id}:`, error);
        counts[id] = 0;
      } else {
        counts[id] = count || 0;
      }
    }
    
    res.json(counts);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/comments/:eventId - Get all comments for a specific event
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/comments - Create a new comment
router.post('/', async (req, res) => {
  try {
    const { event_id, author_name, message } = req.body;
    
    // Validate required fields
    if (!event_id || !author_name || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: event_id, author_name, and message are required' 
      });
    }
    
    // Basic validation
    if (author_name.length > 100) {
      return res.status(400).json({ error: 'Author name too long (max 100 characters)' });
    }
    
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
    }
    
    // Insert the comment
    const { data, error } = await supabase
      .from('comments')
      .insert([{ event_id, author_name, message }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Failed to create comment' });
    }
    
    console.log(`New comment created for event ${event_id} by ${author_name}`);
    res.status(201).json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
