
// src/services/newsService.js
import api, { BASE_BACKEND_URL } from './api'; // <<<<<<<<<<<<<<<< IMPORT BASE_BACKEND_URL

const newsService = {
  BASE_BACKEND_URL, // <<<<<<<<<<<<<<<< EXPORT BASE_BACKEND_URL here for image paths in components

  getAllNews: async () => {
    try {
      const response = await api.get('/news/get-all');
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  getNewsById: async (newsId) => {
    try {
      const response = await api.post('/news/get', { id: newsId });
      return response.data;
    } catch (error) {
      console.error(`Error fetching news with ID ${newsId}:`, error);
      throw error;
    }
  },
};

export default newsService;