// const express = require('express');
// const router = express.Router();
// const screenController = require('../controller/screenController');
// const { verifyAuth } = require('../middleware/auth');


// router.post('/add', verifyAuth, screenController.addScreen);
// router.put('/update', verifyAuth, screenController.updateScreen); 
// router.delete('/delete', verifyAuth, screenController.deleteScreen); 
// router.patch('/toggle-status', verifyAuth, screenController.toggleScreenStatus); 

// router.post('/get', verifyAuth, screenController.getScreenById); 
// router.get('/get-all', verifyAuth, screenController.getAllScreens); 


// router.post('/by-cinema', verifyAuth, screenController.getScreensByCinemaId);

// module.exports = router;


const express = require('express');
const router = express.Router();
const screenController = require('../controller/screenController');
const { verifyAuth } = require('../middleware/auth');

// Admin routes
router.post('/add', verifyAuth, screenController.addScreen);
router.put('/update', verifyAuth, screenController.updateScreen); // expects ID in body
router.delete('/delete', verifyAuth, screenController.deleteScreen); // expects ID in body
router.patch('/toggle-status', verifyAuth, screenController.toggleScreenStatus); // expects ID in body
router.post('/bulk-add', verifyAuth, screenController.bulkAddScreen);

// Shared access
router.post('/get', verifyAuth, screenController.getScreenById); // expects ID in body
router.get('/get-all', screenController.getAllScreens); // public
router.post('/by-cinema', verifyAuth, screenController.getScreensByCinemaId);

// ✅ New route: Get screens by owner_id
router.post('/by-owner', verifyAuth, screenController.getScreensByOwnerId); // expects owner_id in body

module.exports = router;
