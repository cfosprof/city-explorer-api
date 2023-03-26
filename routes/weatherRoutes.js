const express = require('express');
const axios = require('axios');
const Forecast = require('../models/Forecast');
const { cache } = require('../cache');

// Instantiate the Express router
const router = express.Router();

// Define a cache invalidation time in milliseconds (e.g. 2 hours)
const CACHE_INVALIDATION_TIME = 2 * 60 * 60 * 1000;

// Define a helper function to check if cache data is still valid
function isCacheValid(timestamp) {
  return Date.now() - timestamp < CACHE_INVALIDATION_TIME;
}

// Define a GET endpoint for retrieving weather forecasts based on latitude and longitude
router.get('/weather', async (req, res) => {
  // Extract the "lat" and "lon" parameters from the query string
  const { lat, lon } = req.query;

  const cacheKey = `${lat},${lon}`;

  // Check if the cache contains valid data
  if (cache.weather[cacheKey] && isCacheValid(cache.weather[cacheKey].timestamp)) {
    return res.json(cache.weather[cacheKey].data);
  }

  try {
    // Make a request to the weather API with the specified latitude, longitude, API key, and other parameters
    const response = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
      params: {
        lat: lat,
        lon: lon,
        key: process.env.REACT_APP_WEATHER_API_KEY,
        units: 'imperial',
        days: 14
      }
    });

    // Map the response data to an array of Forecast objects
    const forecasts = response.data.data.map(
      (day) =>
        new Forecast(
          day.valid_date,
          `Low of ${day.low_temp}°F, high of ${day.high_temp}°F with ${day.weather.description.toLowerCase()}`
        )
    );

    // Cache the forecast data
    cache.weather[cacheKey] = {
      timestamp: Date.now(),
      data: forecasts,
    };

    // Respond with the array of Forecast objects in JSON format
    res.json(forecasts);
  } catch (error) {
    // If an error occurs, log it and send a 500 response with an error message
    console.error('Error fetching weather data:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response.status);
    console.error('Error data:', error.response.data);
    res.status(500).json({ error: 'Error fetching weather data.' });
  }
});

// Export the router instance for use in other parts of the application
module.exports = router;