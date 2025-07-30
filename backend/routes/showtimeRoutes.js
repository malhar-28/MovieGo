// const express = require('express');
// const router = express.Router();
// const showtimeController = require('../controller/showtimeController');
// const { verifyAuth } = require('../middleware/auth');


// router.post('/add', verifyAuth, showtimeController.addShowtime);
// router.put('/update', verifyAuth, showtimeController.updateShowtime); 
// router.delete('/delete', verifyAuth, showtimeController.deleteShowtime); 
// router.patch('/toggle-status', verifyAuth, showtimeController.toggleShowtimeStatus); 


// router.post('/detail', verifyAuth, showtimeController.getShowtimeById); 
// router.post('/filter', verifyAuth, showtimeController.getShowtimesByMovieAndCinema); 
// router.get('/get-all', verifyAuth, showtimeController.getAllShowtimes); 
// router.post('/booked-seats', verifyAuth, showtimeController.getBookedSeatsForShowtime);
// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const showtimeController = require('../controller/showtimeController');
// const { verifyAuth } = require('../middleware/auth');

// Admin routes
// router.post('/add', verifyAuth, showtimeController.addShowtime);
// router.put('/update', verifyAuth, showtimeController.updateShowtime); 
// router.delete('/delete', verifyAuth, showtimeController.deleteShowtime); 
// router.patch('/toggle-status', verifyAuth, showtimeController.toggleShowtimeStatus); 

// Admin & User access
// router.post('/detail', verifyAuth, showtimeController.getShowtimeById);
// router.post('/filter', verifyAuth, showtimeController.getShowtimesByMovieAndCinema); 
// router.get('/get-all', verifyAuth, showtimeController.getAllShowtimes); 
// router.post('/booked-seats', verifyAuth, showtimeController.getBookedSeatsForShowtime);
// ...
// Change this line:
// router.post('/booked-seats', verifyAuth, showtimeController.getBookedSeatsForShowtime);
// router.get('/booked-seats/:showtimeId', verifyAuth, showtimeController.getBookedSeatsForShowtime); 



// router.post('/by-cinema', verifyAuth, showtimeController.getShowtimesByCinemaId);
// // ...
// module.exports = router;

// routes/showtimeRoutes.js
const express = require('express');
const router = express.Router();
const showtimeController = require('../controller/showtimeController');
const { verifyAuth } = require('../middleware/auth');

// Admin routes
router.post('/add', verifyAuth, showtimeController.addShowtime);
router.put('/update', verifyAuth, showtimeController.updateShowtime); // expects id in body
router.delete('/delete', verifyAuth, showtimeController.deleteShowtime); // expects id in body
router.patch('/toggle-status', verifyAuth, showtimeController.toggleShowtimeStatus); // expects id in body

// Admin & User access (now also guest access for viewing)
router.post('/detail', showtimeController.getShowtimeById); // MODIFIED: Removed verifyAuth
router.post('/filter', showtimeController.getShowtimesByMovieAndCinema); // MODIFIED: Removed verifyAuth
router.get('/get-all', verifyAuth, showtimeController.getAllShowtimes); // admin access
router.post('/showtime-by-city-cinema-date', showtimeController.getShowtimesByFilter);
router.get('/booked-seats/:showtimeId', verifyAuth, showtimeController.getBookedSeatsForShowtime); // This route remains protected as it's part of seat selection

router.post('/by-cinema', showtimeController.getShowtimesByCinemaId); // MODIFIED: Removed verifyAuth

 router.post('/by-owner', verifyAuth, showtimeController.getShowtimesByOwnerId);
 router.post('/bulk-add', verifyAuth, showtimeController.bulkAddShowtimes);

module.exports = router;