'use strict';

const express = require('express');
const cors = require('cors');
const app = express();


// Load environment variables from .env file
require('dotenv').config();

// Enable Cross-Origin Resource Sharing (CORS) middleware
// Allows calls from Front End to Back End
app.use(cors());

// Set the server port to the environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Parse incoming request bodies as JSON
app.use(express.json());

// Define a route that returns a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the City Explorer API!');
});

// Import and use the location, map, weather, and movie routes
const locationRoutes = require('./routes/locationRoutes');
const mapRoutes = require('./routes/mapRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use(locationRoutes);
app.use(mapRoutes);
app.use(weatherRoutes);
app.use(movieRoutes);

// Define a function to handle errors and return a 500 response
function handleError(err, res) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
}

// Handle errors using the handleError function and return a 500 response
app.use((err, req, res, next) => {
  handleError(err, res);
});

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

