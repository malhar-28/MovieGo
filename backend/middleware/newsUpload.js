const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // run: npm install uuid

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'NewsImage/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg and .jpeg formats are allowed!'));
  }
};

const limits = {
  fileSize: 15 * 1024 * 1024 // 15 MB
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;