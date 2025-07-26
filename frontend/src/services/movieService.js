// src/services/movieService.js
import api, { BASE_BACKEND_URL } from './api'; // <<<<<<<<<<<<<<<< IMPORT BASE_BACKEND_URL

const movieService = {
  BASE_BACKEND_URL, // <<<<<<<<<<<<<<<< EXPORT BASE_BACKEND_URL here for image paths in components

  getNowPlayingMovies: async () => {
    try {
      const response = await api.get('/movies/now-playing');
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },

  getUpcomingMovies: async () => {
    try {
      const response = await api.get('/movies/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  getMovieById: async (movieId) => {
    try {
      const response = await api.post('/movies/get-public-movie', { id: movieId });
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${movieId}:`, error);
      throw error;
    }
  },
};

export default movieService;