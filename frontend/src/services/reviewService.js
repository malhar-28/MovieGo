// src/services/reviewService.js
import api from './api';

const reviewService = {
  getCinemaReviews: async (cinemaId) => {
    try {
      const response = await api.post('/review/cinema-reviews', { cinema_id: cinemaId });
      return response.data;
    } catch (error) {
      console.error('Error fetching cinema reviews:', error);
      throw error;
    }
  },

  addReview: async (reviewData) => {
    try {
      const response = await api.post('/review/add', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  updateReview: async (reviewData) => {
    try {
      const response = await api.put('/review/update', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (reviewData) => {
    try {
      const response = await api.delete('/review/delete', { data: reviewData });
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
};

export default reviewService;
