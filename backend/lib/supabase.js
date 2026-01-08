// lib/supabase.js
// Supabase client for connecting to our PostgreSQL database
// This uses the SERVICE ROLE key (not anon) since this is server-side
// and we want full access without Row Level Security restrictions

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Warning: Supabase credentials not configured');
}

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

module.exports = { supabase };
