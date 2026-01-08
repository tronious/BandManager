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

const app = express();

// read the azure port from the environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// middleware

// CORS - restrict to your frontend domain only
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://troniousmusic.com',
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


app.listen(PORT, () => {
  console.log(`Backend listening in Azure on port ${PORT}`);
});
