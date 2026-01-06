const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

// health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'bandmanager-backend'
  });
  console.log('Health check OK');
});

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
