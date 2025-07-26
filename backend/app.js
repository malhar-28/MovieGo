// File: backend/app.js (UPDATED)
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const cinemaRoutes = require('./routes/cinemaRoutes');
const reviewRoutes = require('./routes/cinemaReviewRoutes');
const movieRoutes = require('./routes/movieRoutes');
// NEW IMPORTS
const screenRoutes = require('./routes/screenRoutes');
const seatLayoutRoutes = require('./routes/seatLayoutRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const newsRoutes = require('./routes/newsRoutes');
const cinemaOwnerRoutes = require('./routes/cinemaOwnerRoutes');
const cinemaManagerRoutes = require('./routes/cinemaManagerRoutes');

const path = require('path');
const fs = require('fs');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static image directories
// console.log('Attempting to serve static files for /UserImage from:', path.join(__dirname, 'UserImage'));
app.use('/UserImage', express.static(path.join(__dirname, 'UserImage')));
app.use('/CinemaImage', express.static(path.join(__dirname, 'CinemaImage')));
const movieImageDir = path.join(__dirname, 'MovieImages');
app.use('/MovieImages', express.static(movieImageDir)); // Serve movie images
app.use('/NewsImage', express.static(path.join(__dirname, 'NewsImage'))); 
const cinemaOwnerImageDir = path.join(__dirname, 'CinemaOwnerImage');
if (!fs.existsSync(cinemaOwnerImageDir)) {
  fs.mkdirSync(cinemaOwnerImageDir);
}
app.use('/CinemaOwnerImage', express.static(path.join(__dirname, 'CinemaOwnerImage')));
// Routes
app.use('/api/user', userRoutes);
app.use('/api/cinema', cinemaRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/screen', screenRoutes);
app.use('/api/seats', seatLayoutRoutes); 
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/cinema-owner', cinemaOwnerRoutes);
app.use('/api/cinema-manager', cinemaManagerRoutes);
module.exports = app;