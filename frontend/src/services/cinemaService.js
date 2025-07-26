// src/services/cinemaService.js
import api from './api'; // <<<<<<<<<<<<<<<< IMPORT YOUR CONFIGUERED API INSTANCE

// Remove BASE_BACKEND_URL, as 'api' already has it configured
// const BASE_BACKEND_URL = 'http://localhost:5000';

const cinemaService = {
  getAllCinemas: async () => {
    try {
      // Use 'api' instance, path is relative to api.baseURL ('/api')
      const response = await api.get('/cinema/get-all-cinema'); // <<<<<<<<<<<<<<<< MODIFIED
      return response.data;
    } catch (error) {
      console.error('Error fetching all cinemas:', error);
      throw error;
    }
  },

  getCinemaById: async (cinemaId) => {
    try {
      // Use 'api' instance
      const response = await api.post('/cinema/get-cinema', { id: cinemaId }); // <<<<<<<<<<<<<<<< MODIFIED
      return response.data;
    } catch (error) {
      console.error(`Error fetching cinema with ID ${cinemaId}:`, error);
      throw error;
    }
  },

  addCinema: async (cinemaData) => {
    try {
      // Use 'api' instance
      const response = await api.post('/cinema/add', cinemaData, { // <<<<<<<<<<<<<<<< MODIFIED
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding cinema:', error);
      throw error;
    }
  },

  updateCinema: async (cinemaData) => {
    try {
      // Use 'api' instance
      const response = await api.put('/cinema/update', cinemaData, { // <<<<<<<<<<<<<<<< MODIFIED
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cinema:', error);
      throw error;
    }
  },

  deleteCinema: async (cinemaId) => {
    try {
      // Use 'api' instance
      const response = await api.delete('/cinema/delete', { data: { id: cinemaId } }); // <<<<<<<<<<<<<<<< MODIFIED
      return response.data;
    } catch (error) {
      console.error(`Error deleting cinema with ID ${cinemaId}:`, error);
      throw error;
    }
  },
};

export default cinemaService;