

const express = require('express');
const router = express.Router();
const newsController = require('../controller/newsController');
const upload = require('../middleware/newsUpload');
const { verifyAuth } = require('../middleware/auth');

// Admin routes
router.post('/add', verifyAuth, upload.any(), newsController.addNews);
router.get('/get-all', newsController.getAllNews);
router.post('/get', newsController.getNewsById); // Changed to POST to send ID in body
router.put('/update', verifyAuth, upload.any(), newsController.updateNews); // Changed to PUT with body
router.delete('/delete', verifyAuth, newsController.deleteNews); // Changed to DELETE with body
router.patch('/toggle-status', verifyAuth, newsController.toggleNewsStatus); // Changed to PATCH with body

module.exports = router;