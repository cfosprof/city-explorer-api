const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const { cache } = require('../cache');

// Instantiate Express router
const router = express.Router();

// Define a cache invalidation time in milliseconds (e.g. 2 hours)
const CACHE_INVALIDATION_TIME = 2 * 60 * 60 * 1000;

// Define a helper function to check if cache data is still valid
function isCacheValid(timestamp) {
  return Date.now() - timestamp < CACHE_INVALIDATION_TIME;
}

// Define a GET endpoint for retrieving movies based on a city
router.get('/movies', async (req, res) => {
  // Extract the "city" parameter from the query string
  const { city } = req.query;

  // Check if the cache contains valid data
  if (cache.movies[city] && isCacheValid(cache.movies[city].timestamp)) {
    return res.json(cache.movies[city].data);
  }

  try {
    // Make a request to the movie database API with our API key and city
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        query: city,
        include_adult: false,
      },
    });

    // Filter out any movies without a poster image and map the remaining results to an array of Movie objects
    const movies = response.data.results
      .filter((movie) => movie.poster_path)
      .map(
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

    // Cache the movie data
    cache.movies[city] = {
      timestamp: Date.now(),
      data: movies,
    };

    // Respond with the array of Movie objects in JSON format
    res.json(movies);
  } catch (error) {
    // Log the error and respond with a 500 error and an error message in JSON format
    console.error('Error fetching movie data:', error);
    res.status(500).json({ error: 'Error fetching movie data.' });
  }
});

// Export the router instance for use in other parts of the application
module.exports = router;
