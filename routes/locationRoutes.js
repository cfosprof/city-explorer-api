const express = require('express');
const axios = require('axios');

// Create an instance of the Express router
const router = express.Router();

// Define a GET endpoint for retrieving location data based on an address query
router.get('/location', async (req, res) => {
  // Extract the "q" parameter from the query string
  const { q } = req.query;

  try {
    // Make a request to the Google Maps API with the specified API key and address query
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        address: q,
      },
    });

    // Respond with the response data in JSON format
    res.json(response.data.results);
  } catch (error) {
    // If an error occurs, log it and send a 500 response with an error message
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Error fetching location data.' });
  }
});

// Export the router instance for use in other parts of the application
module.exports = router;