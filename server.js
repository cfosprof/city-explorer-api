'use strict';

const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT || 3000;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the City Explorer API!');
});

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
      params: {
        lat: lat,
        lon: lon,
        key: process.env.WEATHER_API_KEY,
        units: 'imperial',
      },
    });

    const forecasts = response.data.data.map(
      (day) =>
        new Forecast(
          day.datetime,
          `Low of ${day.low_temp}°F, high of ${day.high_temp}°F with ${day.weather.description.toLowerCase()}`
        )
    );

    res.json(forecasts);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data.' });
  }
});

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
