const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'UserImage/'),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const email = req.body.email.replace(/[^a-zA-Z0-9]/g, '');
//     cb(null, `${email}${ext}`);
//   }
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'UserImage/'),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
    
//     // Use ID for authenticated requests, email for new registrations
//     const identifier = req.user?.id 
//       ? req.user.id 
//       : (req.body.email 
//           ? req.body.email.replace(/[^a-zA-Z0-9]/g, '') 
//           : Date.now().toString()
//         );

//     cb(null, `${identifier}${ext}`);
//   }
// });

// userUpload.js
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'UserImage/'),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const identifier = req.user?.id
//       ? req.user.id
//       : (req.body.email
//           ? req.body.email.replace(/[^a-zA-Z0-9]/g, '')
//           : Date.now().toString()
//         );
    
//     cb(null, `${identifier}-${Date.now()}${ext}`); 
//   }
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'UserImage/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const identifier = req.user?.id
      ? req.user.id
      : (req.body.email
          ? req.body.email.replace(/[^a-zA-Z0-9]/g, '')
          : Date.now().toString()
        );
    const newFilename = `${identifier}-${Date.now()}${ext}`; // This is the line that adds timestamp
    console.log('Multer generating new filename:', newFilename); // <-- ADD THIS
    cb(null, newFilename);
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