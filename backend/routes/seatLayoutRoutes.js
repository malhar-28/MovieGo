// const express = require('express');
// const router = express.Router();
// const seatLayoutController = require('../controller/seatLayoutController');
// const { verifyAuth } = require('../middleware/auth');


// router.post('/add', verifyAuth, seatLayoutController.addSeatLayout);
// router.post('/bulk', verifyAuth, seatLayoutController.bulkAddSeats);
// router.put('/update', verifyAuth, seatLayoutController.updateSeatLayout); 
// router.delete('/delete', verifyAuth, seatLayoutController.deleteSeatLayout); 
// router.patch('/toggle-status', verifyAuth, seatLayoutController.toggleSeatLayoutStatus); 


// router.post('/get-by-id', verifyAuth, seatLayoutController.getSeatLayoutById); 
// router.post('/get-by-screen', verifyAuth, seatLayoutController.getSeatsByScreenId); 
// router.get('/get-all', verifyAuth, seatLayoutController.getAllSeatLayouts);

// module.exports = router;

const express = require('express');
const router = express.Router();
const seatLayoutController = require('../controller/seatLayoutController');
const { verifyAuth } = require('../middleware/auth');

// Admin routes
router.post('/add', verifyAuth, seatLayoutController.addSeatLayout);
router.post('/bulk', verifyAuth, seatLayoutController.bulkAddSeats);
router.put('/update', verifyAuth, seatLayoutController.updateSeatLayout); // expects ID in body
router.delete('/delete', verifyAuth, seatLayoutController.deleteSeatLayout); // expects ID in body
router.patch('/toggle-status', verifyAuth, seatLayoutController.toggleSeatStatus); 

// Admin & User access
router.post('/get-by-id', verifyAuth, seatLayoutController.getSeatById);         
router.post('/get-by-screen', verifyAuth, seatLayoutController.getSeatsByScreen); 
router.get('/get-all', verifyAuth, seatLayoutController.getAllSeats);            

module.exports = router;