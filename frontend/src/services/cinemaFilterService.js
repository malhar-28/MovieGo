// src/services/cinemaFilterService.js
import api from './api';

const cinemaFilterService = {
  getFilteredCinemasData: async (movieId, city, date) => {
    try {
      const params = { movieId, city, date };
      const response = await api.get('/cinema/filtered-cinemas-data', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered cinemas data:', error);
      throw error;
    }
  }
};

export default cinemaFilterService;
