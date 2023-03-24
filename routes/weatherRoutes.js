const express = require('express');
const axios = require('axios');
const Forecast = require('../models/Forecast');
const router = express.Router();

router.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
      params: {
        lat: lat,
        lon: lon,
        key: process.env.WEATHER_API_KEY,
        units: 'imperial',
        days: 14
      }
    });

    const forecasts = response.data.data.map(
      (day) =>
        new Forecast(
          day.valid_date,
          `Low of ${day.low_temp}°F, high of ${day.high_temp}°F with ${day.weather.description.toLowerCase()}`
        )
    );

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

module.exports = router;