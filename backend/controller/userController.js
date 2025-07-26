const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/emailService');
const { generateOtpEmailContent } = require('../utils/emailTemplates');
const path = require('path');
const fs = require('fs');

const otpStore = new Map(); // In-memory OTP store (replace with Redis in prod)






const generateRegistrationEmailContent = (user) => {
  const userName = user.name || 'User';
  const email = user.email;
  const registeredAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return `
    <div style="max-width:600px;margin:auto;background-color:#f9f9f9;border-radius:12px;font-family:Inter,sans-serif;overflow:hidden;border:1px solid #ddd;">
      <div style="background-color:#0B193F;color:white;padding:20px;text-align:center;">
        <h2 style="margin:0;">Welcome to MovieGo!</h2>
      </div>

      <div style="padding:20px;background-color:white;">
        <p style="font-size:16px;color:#333;">Hello <strong>${userName}</strong>,</p>

        <p style="font-size:15px;">🎉 You have successfully registered on <strong>MovieGo</strong>!</p>

        <table style="width:100%;font-size:14px;margin:20px 0;border-collapse:collapse;">
          <tr><td style="padding:8px 0;"><strong>Registered Email:</strong></td><td>${email}</td></tr>
          <tr><td style="padding:8px 0;"><strong>Registered On:</strong></td><td>${registeredAt}</td></tr>
        </table>

        <p style="font-size:14px;margin-top:20px;">We’re excited to have you onboard. Start exploring movies, book tickets, and enjoy!</p>

        <p style="margin-top:30px;font-size:14px;color:#777;">Cheers,<br/><strong>MovieGo Team</strong></p>
      </div>
    </div>
  `;
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const create_user = req.user?.email || email; // fallback to email if public route
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file?.filename || null;

    await pool.execute('CALL RegisterUser(?, ?, ?, ?, ?)', [name, email, hashedPassword, image, create_user]);

// Send registration email
try {
  const registrationEmailHtml = generateRegistrationEmailContent({ name, email });
  await sendEmail(email, 'Welcome to MovieGo! Your Registration is Successful', registrationEmailHtml);
  console.log(`Registration email sent to ${email}`);
} catch (emailErr) {
  console.error('Error sending registration email:', emailErr);
}

res.json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute('CALL GetUserByEmail(?)', [email]);
    const user = rows[0][0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken({ id: user.id, email: user.email });
    res.json({ token, email:user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.updateUser = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const image = req.file?.filename || null;
//     const id = req.user.id;
//     const update_user = req.user.email;

//     if (req.file && req.user.image) {
//       const oldImagePath = path.join(__dirname, '..', 'UserImage', req.user.image);
//       fs.unlink(oldImagePath, (err) => {
//         if (err) console.error('Error deleting old image:', err);
//       });
//     }
    

//     await pool.execute('CALL UpdateUser(?, ?, ?, ?)', [
//       id,
//       name || null,
//       image,
//       update_user
//     ]);

    
// const [updatedRows] = await pool.execute('CALL GetUserById(?)', [id]);
// const updatedUser = updatedRows[0][0];
// res.json({ message: 'User updated successfully', user: updatedUser });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateUser = async (req, res) => {
  try {
    console.log('----- updateUser function started -----');
    console.log('Incoming req.file (from Multer):', req.file); // <-- ADD THIS
    console.log('Incoming req.body:', req.body); // <-- ADD THIS

    const { name } = req.body;
    const image = req.file?.filename || null; // This gets the new filename from multer
    const id = req.user.id;
    const update_user = req.user.email;

    console.log('Filename extracted for DB update:', image); // <-- ADD THIS
    console.log('User ID for update:', id); // <-- ADD THIS

    // This block attempts to delete the old image
    if (req.file && req.user.image) {
      const oldImagePath = path.join(__dirname, '..', 'UserImage', req.user.image);
      console.log('Attempting to delete old image:', oldImagePath); // <-- ADD THIS
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
    }

    // Call the stored procedure to update the user
    await pool.execute('CALL UpdateUser(?, ?, ?, ?)', [
      id,
      name || null,
      image, // This 'image' is the new filename
      update_user
    ]);
    console.log('CALL UpdateUser executed with image value:', image); // <-- ADD THIS

    // Retrieve the updated user from the database
    const [updatedRows] = await pool.execute('CALL GetUserById(?)', [id]);
    const updatedUser = updatedRows[0][0]; // This is the user object from the DB
    console.log('User data fetched after update (from DB):', updatedUser); // <-- ADD THIS

    // Send the response with the updated user object
    res.json({ message: 'User updated successfully', user: updatedUser });
    console.log('----- updateUser function finished successfully -----');

  } catch (err) {
    console.error('Error in updateUser:', err); // <-- MODIFIED FOR BETTER LOGGING
    res.status(500).json({ error: err.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'User ID is required' });

    const [rows] = await pool.execute('CALL GetUserById(?)', [id]);
    res.json(rows[0][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const update_user = req.user.email;
    const id = req.user.id;

    const [rows] = await pool.execute('CALL GetUserById(?)', [id]);
    const user = rows[0][0];

    if (!user || !user.password) {
      return res.status(404).json({ message: 'User not found or password missing' });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.execute('CALL ChangeUserPassword(?, ?, ?)', [id, hashedPassword, update_user]);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute('CALL GetAllUsers()');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const update_user = req.user.email;

    if (!id) return res.status(400).json({ message: 'User ID is required' });

    await pool.execute('CALL ToggleUserStatus(?)', [id]); // Update your SP accordingly
    res.json({ message: 'User status toggled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const [rows] = await pool.execute('CALL GetUserByEmail(?)', [email]);
    const user = rows[0][0];
    if (!user) return res.status(404).json({ message: 'No user found with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // Valid 10 mins

    const htmlContent = generateOtpEmailContent(otp);
    await sendEmail(email, 'Reset Your Password – MovieGo OTP', htmlContent);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};


exports.resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  const entry = otpStore.get(email);
  if (!entry || entry.otp !== otp || Date.now() > entry.expires) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute('CALL ResetUserPasswordWithEmail(?, ?)', [email, hashedPassword]);
    otpStore.delete(email);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error resetting password with OTP:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
