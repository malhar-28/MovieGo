// const express = require('express');
// const router = express.Router();
// const cinemaReviewController = require('../controller/cinemaReviewController');
// const { verifyAuth } = require('../middleware/auth');

// router.post('/add', verifyAuth, cinemaReviewController.addReview);
// router.put('/update', verifyAuth, cinemaReviewController.updateReview);           
// router.delete('/delete', verifyAuth, cinemaReviewController.deleteReview);         
// router.post('/cinema-reviews', verifyAuth, cinemaReviewController.getCinemaReviews); 
// router.get('/get-all-review', verifyAuth, cinemaReviewController.getAllReviews);
// router.put('/toggle-review', verifyAuth, cinemaReviewController.toggleReviewStatus); 



// module.exports = router;

// routes/cinemaReviewRoutes.js
const express = require('express');
const router = express.Router();
const cinemaReviewController = require('../controller/cinemaReviewController');
const { verifyAuth } = require('../middleware/auth');

// User-side
router.post('/add', verifyAuth, cinemaReviewController.addReview);
router.put('/update', verifyAuth, cinemaReviewController.updateReview);
router.delete('/delete', verifyAuth, cinemaReviewController.deleteReview);
router.post('/cinema-reviews', cinemaReviewController.getCinemaReviews); // MODIFIED: Removed verifyAuth
router.get('/get-all-review', verifyAuth, cinemaReviewController.getAllReviews);
router.put('/toggle-review', verifyAuth, cinemaReviewController.toggleReviewStatus);
router.post('/get-by-owner', verifyAuth, cinemaReviewController.getReviewsByOwnerId); // expects owner_id in body

module.exports = router;
