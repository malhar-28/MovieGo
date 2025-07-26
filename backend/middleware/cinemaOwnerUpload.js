const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'CinemaOwnerImage/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const email = req.body.email?.replace(/[^a-zA-Z0-9]/g, '') || 'owner';
    cb(null, `${email}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only jpeg, jpg, png files allowed'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});