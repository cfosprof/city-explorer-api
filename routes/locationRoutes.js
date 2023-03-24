const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/location', async (req, res) => {
  const { q } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        address: q,
      },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Error fetching location data.' });
  }
});

module.exports = router;
