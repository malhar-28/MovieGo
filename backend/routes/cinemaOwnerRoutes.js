const express = require('express');
const router = express.Router();
const upload = require('../middleware/cinemaOwnerUpload');
const { verifyAuth } = require('../middleware/auth');
const controller = require('../controller/cinemaOwnerController');

router.post('/register', upload.single('image'), controller.register);
router.post('/login', controller.login);
router.put('/toggle-status', verifyAuth, controller.toggleStatus);
router.put('/toggle-verification', verifyAuth, controller.toggleVerification);
router.get('/get-all-owners', verifyAuth, controller.getAllOwners);
module.exports = router;