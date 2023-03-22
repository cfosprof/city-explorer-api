'use strict';

const express = require('express');
const axios = require('axios');
const app = express();

// Load environment variables from .env file
require('dotenv').config();

// Enable Cross-Origin Resource Sharing (CORS)
const cors = require('cors');
app.use(cors());

// Set the server port to the value of the PORT environment variable, or 3000 if it is not set
const PORT = process.env.PORT || 3000;

// Define a class for storing forecast data
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

// Parse request bodies as JSON
app.use(express.json());

// Define a default route that returns a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the City Explorer API!');
});

// Define a route for fetching weather data
app.get('/weather', async (req, res) => {
  // Extract the latitude and longitude from the query parameters
  const { lat, lon } = req.query;

  try {
    // Send a request to the Weatherbit API to fetch the forecast data for the specified location
    const response = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
      params: {
        lat: lat,
        lon: lon,
        key: process.env.WEATHER_API_KEY,
        units: 'imperial',
      },
    });

    // Extract the forecast data from the response and map it to instances of the Forecast class
    const forecasts = response.data.data.map(
      (day) =>
        new Forecast(
          day.valid_date,
          `Low of ${day.low_temp}°F, high of ${day.high_temp}°F with ${day.weather.description.toLowerCase()}`
        )
    );

    // Send the forecast data as a JSON response
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

// Define a function for handling errors
function handleError(err, res) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
}

// Define an error-handling middleware function that calls the handleError function
app.use((err, req, res, next) => {
  handleError(err, res);
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
