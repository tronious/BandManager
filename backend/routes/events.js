const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// GET /api/events
// Optional query: includePast=1|true|yes
router.get('/', async (req, res) => {
  try {
    const includePastRaw = String(req.query.includePast || '').toLowerCase().trim();
    const includePast = includePastRaw === '1' || includePastRaw === 'true' || includePastRaw === 'yes';
    const today = new Date().toISOString().split('T')[0];

    let query = supabase.from('events').select('*');
    if (!includePast) {
      query = query.gte('date', today); // Default: only future events
    }

    const { data, error } = await query.order('date', { ascending: true });

    if (error) throw error;
    
    res.json(data || []);
    console.log('GET /api/events called');
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;