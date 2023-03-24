const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const router = express.Router();

router.get('/movies', async (req, res) => {
  const { city } = req.query;

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.MOVIE_API_KEY,
        query: city,
        include_adult: false,
      },
    });

    const movies = response.data.results.map(
      (movie) =>
        new Movie(
          movie.title,
          movie.overview,
          movie.vote_average,
          movie.vote_count,
          `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          movie.popularity,
          movie.release_date
        )
    );
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).json({ error: 'Error fetching movie data.' });
  }
});

module.exports = router;
