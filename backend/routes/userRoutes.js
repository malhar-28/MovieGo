const express = require('express');
const router = express.Router();
const upload = require('../middleware/userUpload');
const { verifyAuth } = require('../middleware/auth');
const userController = require('../controller/userController');

// Register with image upload
router.post('/register', upload.single('image'), userController.register);
// Admin: Get all users
router.get('/users', verifyAuth,userController.getAllUsers);

// Admin: Toggle user status
// router.put('/toggle-status/:id', verifyAuth,userController.toggleStatus);
//Cinema
// Login
router.post('/login', userController.login);

// Update user name
router.put('/update', verifyAuth, upload.single('image'), userController.updateUser);
// Get user by ID
// router.get('/:id', verifyAuth,userController.getUserById);

// Change password
router.put('/change-password', verifyAuth, userController.changePassword);
router.post('/get-user', verifyAuth, userController.getUserById); // Changed to POST
router.put('/toggle-status', verifyAuth, userController.toggleStatus); // ID will come in body
router.put("/change-city", verifyAuth, userController.changeCity); // Change city
router.post('/send-otp', userController.sendOtp);
router.post('/reset-password-with-otp', userController.resetPasswordWithOtp);


module.exports = router;
