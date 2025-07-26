import api from './api';

const BASE_BACKEND_URL = 'http://localhost:5000';

const bookingService = {
  BASE_BACKEND_URL,

  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/booking/create', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  getUserBookings: async () => {
    try {
      const response = await api.get('/booking/my');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      await api.put('/booking/cancel-booking', { id: bookingId });
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to cancel booking');
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const response = await api.post('/booking/get-booking', { id: bookingId });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch booking details');
    }
  }
};

export default bookingService;
