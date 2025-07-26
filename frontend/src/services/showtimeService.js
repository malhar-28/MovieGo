import api from './api';

const showtimeService = {
  getShowtimesForMovieAndCinema: async (movieId, cinemaId, showDate) => {
    try {
      const response = await api.post('/showtimes/filter', {
        movie_id: movieId,
        cinema_id: cinemaId,
        show_date: showDate
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching showtimes for movie ${movieId}, cinema ${cinemaId} on ${showDate}:`, error);
      if (error.response) {
        console.log('Backend response data (if available):', error.response.data);
        console.log('Backend response status:', error.response.status);
        console.log('Backend response headers:', error.response.headers);
      }
      throw error;
    }
  },

  getShowtimeById: async (showtimeId) => {
    try {
      const response = await api.post(
        `/showtimes/detail`,
        { id: showtimeId }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching showtime with ID ${showtimeId}:`, error);
      throw error;
    }
  },

  getAvailableSeats: async (showtimeId) => {
    try {
      const showtimeDetails = await showtimeService.getShowtimeById(showtimeId);
      if (!showtimeDetails || !showtimeDetails.screen_id) {
        throw new Error('Showtime details or screen ID not found for fetching seats.');
      }
      const screenId = showtimeDetails.screen_id;
      const seats = await seatLayoutService.getSeatsByScreenId(screenId);
      return seats;
    } catch (error) {
      console.error(`Error fetching available seats for showtime ${showtimeId}:`, error);
      throw error;
    }
  },

  getBookedSeatsForShowtime: async (showtimeId) => {
    try {
      const response = await api.get(`/booking/showtime-seats/${showtimeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booked seats for showtime:', error);
      throw error;
    }
  }
};

export default showtimeService;
