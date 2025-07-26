// src/services/seatLayoutService.js
import api from './api'; // <<<<<<<<<<<<<<<< IMPORT YOUR CONFIGUERED API INSTANCE

// Remove BASE_BACKEND_URL, as 'api' already has it configured
// const BASE_BACKEND_URL = 'http://localhost:5000';

const seatLayoutService = {
  getSeatsByScreenId: async (screenId) => {
    try {
      // Remove manual token handling
      // const userString = localStorage.getItem('user');
      // let token = null;
      // if (userString) {
      //   try {
      //     const user = JSON.parse(userString);
      //     token = user?.token;
      //   } catch (parseError) {
      //     console.error("Error parsing user data from localStorage in seatLayoutService:", parseError);
      //   }
      // }
      // if (!token) {
      //   console.error("Authentication token is missing. Cannot fetch seat layout.");
      //   throw new Error('Authentication token not found.');
      // }

      // Use 'api' instance, auth is handled by interceptor
      const response = await api.get(`/seats/screen/${screenId}`); // <<<<<<<<<<<<<<<< MODIFIED
      return response.data;
    } catch (error) {
      console.error(`Error fetching seats for screen ID ${screenId}:`, error);
      if (error.response) {
        console.error("Backend response data:", error.response.data);
        console.error("Backend response status:", error.response.status);
      }
      throw error;
    }
  },
};

export default seatLayoutService;