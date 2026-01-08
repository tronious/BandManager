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

const app = express();

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

// hard code these for now...no auth or db yet
app.get('/api/events', (req, res) => {
  res.json([
    { id: '1', name: 'King Seat Tavern', date: '2026-01-10' },
    { id: '2', name: 'Winery Night', date: '2026-01-17' }
  ]);
  console.log('GET /api/events called');
});

// Comments API routes (connected to Supabase/PostgreSQL)
app.use('/api/comments', commentsRouter);

// Bookings API routes (sends email notifications)
app.use('/api/bookings', bookingsRouter);


app.listen(PORT, () => {
  console.log(`Backend listening in Azure on port ${PORT}`);
});
