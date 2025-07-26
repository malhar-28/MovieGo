// src/services/api.js
import axios from 'axios';

// export const BASE_BACKEND_URL = 'http://localhost:5000';
export const BASE_BACKEND_URL = import.meta.env.VITE_BASE_URL;

const API_BASE_URL = `${BASE_BACKEND_URL}/api`;

const publicRoutes = [
  '/movies/now-playing',
  '/movies/upcoming',
  '/news/get-all',
  '/news/get', // Assuming this is also public to get individual news items
  '/cinema/get-all-cinema', // ADDED: Public route for all cinemas
  '/cinema/get-cinema',     // ADDED: Public route for single cinema details
  '/cinema/filtered-cinemas-data', // ADDED: Public route for filtered cinema data
  '/movies/get-all-movies', // ADDED: Public route for all movies
  '/movies/get-public-movie', // ADDED: Public route for public movie details
  '/showtime/detail',       // ADDED: Public route for showtime details
  '/showtimes/filter',      // MODIFIED: Corrected to plural 'showtimes' for filter route
  '/showtime/by-cinema',    // ADDED: Public route for showtimes by cinema
  '/screen/get-all',        // ADDED: Public route for all screens (to fix the last 401)
  '/review/cinema-reviews', // ADDED: Public route for cinema reviews
];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Check if the current request URL (config.url) contains any of the publicRoutes
    // Use a more robust check to ensure it matches the start of the path
    const isPublicRoute = publicRoutes.some(route => config.url.startsWith(route));

    if (!isPublicRoute) {
      const userString = localStorage.getItem('user');
      console.log('User from localStorage:', userString); // Debugging line
      let token = null;
      if (userString) {
        try {
          const user = JSON.parse(userString);
          token = user?.token;
        } catch (e) {
          console.error("Error parsing user from localStorage in Axios interceptor:", e);
        }
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.error("No token found for non-public route:", config.url); // Debugging line
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;