const express = require('express');
const router = express.Router();
const cinemaManagerController = require('../controller/cinemaManagerController');
const { verifyAuth } = require('../middleware/auth'); // ✅ Import verifyAuth middleware

// Manager authentication and status routes
router.post('/register', cinemaManagerController.registerManager);
router.post('/login', cinemaManagerController.loginManager);
router.post('/toggle-status',verifyAuth, cinemaManagerController.toggleManagerStatus);

// Protected routes (require token)
router.get('/managers', verifyAuth, cinemaManagerController.getAllManagers);
router.post('/managers-by-owner', verifyAuth, cinemaManagerController.getManagersByOwner);
router.put('/change-password', verifyAuth, cinemaManagerController.changePassword);
module.exports = router;
