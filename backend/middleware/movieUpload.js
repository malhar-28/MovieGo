const multer = require('multer');
const path = require('path');
const fs = require('fs');

const movieImageDir = 'MovieImages/';
// Ensure MovieImages directory exists
if (!fs.existsSync(movieImageDir)) {
    fs.mkdirSync(movieImageDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, movieImageDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        // For bulk uploads, use index if available, otherwise use timestamp
        const index = req.body.index ? `_${req.body.index}` : '';
        const movieTitle = req.body[`title${index}`] 
            ? req.body[`title${index}`].replace(/[^a-zA-Z0-9]/g, '_')
            : `movie_${Date.now()}${index}`;

        let fileName;
        if (file.fieldname.includes('poster_image')) {
            fileName = `${movieTitle}-poster${ext}`;
        } else if (file.fieldname.includes('background_image')) {
            fileName = `${movieTitle}-background${ext}`;
        } else {
            fileName = `${movieTitle}-${file.fieldname || 'misc'}_${Date.now()}${ext}`;
        }
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error('Only png, jpg, jpeg files are allowed for movie images.'));
    }
};

// Create multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: { 
        fileSize: 15 * 1024 * 1024, // 15 MB per file
        files: 20 // Maximum 20 files (10 movies × 2 images each)
    }
});

// Configure for bulk upload
const bulkUpload = upload.fields([
    { name: 'poster_image_0', maxCount: 1 },
    { name: 'background_image_0', maxCount: 1 },
    { name: 'poster_image_1', maxCount: 1 },
    { name: 'background_image_1', maxCount: 1 },
    { name: 'poster_image_2', maxCount: 1 },
    { name: 'background_image_2', maxCount: 1 },
    { name: 'poster_image_3', maxCount: 1 },
    { name: 'background_image_3', maxCount: 1 },
    { name: 'poster_image_4', maxCount: 1 },
    { name: 'background_image_4', maxCount: 1 },
    { name: 'poster_image_5', maxCount: 1 },
    { name: 'background_image_5', maxCount: 1 },
    { name: 'poster_image_6', maxCount: 1 },
    { name: 'background_image_6', maxCount: 1 },
    { name: 'poster_image_7', maxCount: 1 },
    { name: 'background_image_7', maxCount: 1 },
    { name: 'poster_image_8', maxCount: 1 },
    { name: 'background_image_8', maxCount: 1 },
    { name: 'poster_image_9', maxCount: 1 },
    { name: 'background_image_9', maxCount: 1 }
]);

// For single upload
const singleUpload = upload.fields([
    { name: 'poster_image', maxCount: 1 },
    { name: 'background_image', maxCount: 1 }
]);

module.exports = {
    bulkUpload,
    singleUpload,
    upload // Export the raw multer instance if needed elsewhere
};