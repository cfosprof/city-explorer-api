'use strict';

const express = require('express');
const cors = require('cors');
const app = express();

// Load environment variables
require('dotenv').config();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

const PORT = process.env.PORT || 3000;

// Parse request bodies as JSON
app.use(express.json());

// Define route that returns welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the City Explorer API!');
});

// Import and use the routes
const locationRoutes = require('./routes/locationRoutes');
const mapRoutes = require('./routes/mapRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use(locationRoutes);
app.use(mapRoutes);
app.use(weatherRoutes);
app.use(movieRoutes);

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
}

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
