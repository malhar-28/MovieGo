// const express = require('express');
// const router = express.Router();
// const cinemaController = require('../controller/cinemaController');
// const { verifyAuth } = require('../middleware/auth');
// const upload = require('../middleware/cinemaUpload');
// router.post('/add', verifyAuth,upload.single('image'), cinemaController.addCinema);
// router.get('/get-all-cinema', verifyAuth,cinemaController.getAllCinemas);

// router.put('/update', verifyAuth, upload.single('image'), cinemaController.updateCinema);
// router.delete('/delete', verifyAuth, cinemaController.deleteCinema);
// router.post('/get-cinema', verifyAuth, cinemaController.getCinemaById);


// router.get('/filtered-cinemas-data', verifyAuth, cinemaController.getFilteredCinemasData);


// router.put('/toggle-status', verifyAuth, cinemaController.toggleCinemaStatus);

// module.exports = router;

// routes/cinemaRoutes.js
const express = require('express');
const router = express.Router();
const cinemaController = require('../controller/cinemaController');
const { verifyAuth } = require('../middleware/auth');
const upload = require('../middleware/cinemaUpload');

router.post('/add', verifyAuth, upload.single('image'), cinemaController.addCinema);
router.get('/get-all-cinema', cinemaController.getAllCinemas); // public
router.put('/update', verifyAuth, upload.single('image'), cinemaController.updateCinema);
router.delete('/delete', verifyAuth, cinemaController.deleteCinema);
router.post('/get-cinema', cinemaController.getCinemaById); // public
router.put('/toggle-status', verifyAuth, cinemaController.toggleCinemaStatus);
router.post('/get-by-owner', verifyAuth, cinemaController.getCinemasByOwner);
router.post('/bulk-add', verifyAuth, upload.any(), cinemaController.bulkAddCinemas);

// ✅ Added public filtered data route from Ver 1
router.get('/filtered-cinemas-data', cinemaController.getFilteredCinemasData); // public

router.post('/cinema-details', cinemaController.getCinemaDetailsWithMovies);
module.exports = router;

