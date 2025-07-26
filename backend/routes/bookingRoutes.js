// File: routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingController');
const { verifyAuth } = require('../middleware/auth'); // Correct import: verifyAuth

// User-side booking functionality
router.post('/create', verifyAuth, bookingController.createBooking); // Create a new booking
router.get('/my', verifyAuth, bookingController.getUserBookings); // Get bookings for the logged-in user

// Admin-side booking functionality
router.get('/get-all', verifyAuth, bookingController.getAllBookings); // Get all bookings for admin
router.post('/get-booking', verifyAuth, bookingController.getBookingByIdAdmin); // ID in body - Assuming you have this SP and controller method
router.put('/cancel-booking', verifyAuth, bookingController.cancelBooking);     // ID in body

// New route for showtime seat status
router.get('/showtime-seats/:showtimeId', verifyAuth, bookingController.getShowtimeSeatStatus); // FIX IS HERE: Use verifyAuth


router.post('/get-by-cinema', verifyAuth, bookingController.getBookingByCinemaIdAdmin);

router.post('/get-by-owner', verifyAuth, bookingController.getBookingByOwnerIdAdmin);

module.exports = router;