/* Simple Express backend for BandManager app I'm building
To do::
- add real data storage (database) later
- add authentication later
- add more API endpoints later
- deploy to Azure App Service
- set up CI/CD pipeline
- add logging and error handling
- add tests
- dockerize the app
- add rate limiting and security middleware
*/

express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const commentsRouter = require('./routes/comments');
const bookingsRouter = require('./routes/bookings');
const adminRouter = require('./routes/admin');
const photosRouter = require('./routes/photos');

const app = express();

// Safe config presence logs (helps debug Azure App Settings)
console.log('[config] API_KEY configured:', Boolean(process.env.API_KEY));
console.log('[config] ADMIN_PIN configured:', Boolean(process.env.ADMIN_PIN));
console.log('[config] ADMIN_PASSWORD configured:', Boolean(process.env.ADMIN_PASSWORD));
console.log('[config] FRONTEND_URL:', process.env.FRONTEND_URL || '(not set)');

// Needed for correct req.ip when behind proxies (Azure/Cloudflare)
app.set('trust proxy', 1);

// read the azure port from the environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// middleware

// CORS - allow any localhost port in development, strict in production
const corsOptions = {
  origin: function (origin, callback) {
    const productionUrl = process.env.FRONTEND_URL || 'https://troniousmusic.com';
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // In development, allow any localhost port
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    
    // In production, only allow the configured frontend URL
    if (origin === productionUrl) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  optionsSuccessStatus: 200
};

// API key middleware for additional security
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY;
  
  // Skip auth for health check
  if (req.path === '/health') {
    return next();
  }
  
  // Check API key
  if (!validKey || !apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// enable CORS for specific origin only
app.use(cors(corsOptions));

// parse JSON bodies
app.use(express.json());

// apply API key authentication
app.use(apiKeyAuth);

// health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'bandmanager-backend'
  });
  console.log('Health check OK');
});

// Get all events from database (public endpoint)
const { supabase } = require('./lib/supabase');
app.get('/api/events', async (req, res) => {
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

// Comments API routes (connected to Supabase/PostgreSQL)
app.use('/api/comments', commentsRouter);

// Bookings API routes (sends email notifications)
app.use('/api/bookings', bookingsRouter);

// Admin API routes (sneaky backdoor 🤫)
app.use('/api/admin', adminRouter);

// Event photos API routes (uploads + gallery)
app.use('/api', photosRouter);


app.listen(PORT, () => {
  console.log(`Backend listening in Azure on port ${PORT}`);
});
