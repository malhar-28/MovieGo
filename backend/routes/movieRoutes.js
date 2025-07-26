// const express = require('express');
// const router = express.Router();
// const movieController = require('../controller/movieController');
// const movieUpload = require('../middleware/movieUpload');
// const { verifyAuth } = require('../middleware/auth');

// router.post(
//     '/add',
//     verifyAuth,
//     movieUpload.fields([
//         { name: 'poster_image', maxCount: 1 },
//         { name: 'background_image', maxCount: 1 }
//     ]),
//     movieController.addMovie
// );

// ✅ Use body for update
// router.put(
//     '/update',
//     verifyAuth,
//     movieUpload.fields([
//         { name: 'poster_image', maxCount: 1 },
//         { name: 'background_image', maxCount: 1 }
//     ]),
//     movieController.updateMovie
// );

// ✅ Use body for delete
// router.delete('/delete', verifyAuth, movieController.deleteMovie);

// ✅ Use body for toggle
// router.put('/toggle-status', verifyAuth, movieController.toggleMovieStatus);

// ✅ Use body for get by id
// router.post('/get-movie-byId', verifyAuth, movieController.getMovieByIdAdmin);

// router.get('/get-all-movies', verifyAuth, movieController.getAllMovies);
// router.get('/now-playing', verifyAuth, movieController.getNowPlayingMovies);
// router.get('/upcoming', verifyAuth, movieController.getUpcomingMovies);

// ✅ Public: Get active movie by ID
// router.post('/get-public-movie', verifyAuth, movieController.getMovieById);

// module.exports = router;


// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');
const { bulkUpload, singleUpload, upload } = require('../middleware/movieUpload'); // adjust if needed
const { verifyAuth } = require('../middleware/auth');

// ✅ Protected: Add movie with any file uploads
router.post(
  '/add',
  verifyAuth,
  upload.any(), // Handles all file uploads
  movieController.addMovie
);

// ✅ Protected: Update movie with single upload handler
router.put(
  '/update',
  verifyAuth,
  singleUpload,
  movieController.updateMovie
);

// ✅ Protected: Delete movie
router.delete('/delete', verifyAuth, movieController.deleteMovie);

// ✅ Protected: Toggle movie status
router.put('/toggle-status', verifyAuth, movieController.toggleMovieStatus);

// ✅ Protected: Get movie by ID (admin access)
router.post('/get-movie-byId', verifyAuth, movieController.getMovieByIdAdmin);

// ✅ Public: Get all movies
router.get('/get-all-movies', movieController.getAllMovies);

// ✅ Public: Get now playing movies
router.get('/now-playing', movieController.getNowPlayingMovies);

// ✅ Public: Get upcoming movies
router.get('/upcoming', movieController.getUpcomingMovies);

// ✅ Public: Get a single public movie by ID
router.post('/get-public-movie', movieController.getMovieById);

module.exports = router;
