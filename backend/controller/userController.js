const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/emailService');
const { generateOtpEmailContent } = require('../utils/emailTemplates');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
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
    const { name, email, mobile, password } = req.body;

    // Basic validations
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!contactRegex.test(mobile)) {
      return res.status(400).json({ error: 'Invalid contact number. Must be a valid Indian number.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute('CALL RegisterUser(?, ?, ?, ?, ?)', [
      name,
      email,
      mobile,
      hashedPassword,
      email // or any other value you want for create_user
    ]);


    try {
      const registrationEmailHtml = generateRegistrationEmailContent({ name, email });
      await sendEmail(email, 'Welcome to MovieGo! Your Registration is Successful', registrationEmailHtml);
      console.log(`Registration email sent to ${email}`);
    } catch (emailErr) {
      console.error('Error sending registration email:', emailErr);
    }

    res.json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed. Please try again later.' });
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
    res.json({ token, email: user.email });
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

    const {
      name,
      mobile,
      dob,
      gender,
      city,
      pincode
    } = req.body;

    const image = req.file?.filename || null;
    const id = req.user.id;
    const update_user = req.user.email;

    // --- VALIDATION SECTION ---
    const errors = [];

    // Name: optional, string, max 100 chars
    if (name && (typeof name !== 'string' || name.trim().length > 100)) {
      errors.push('Name must be a string and max 100 characters.');
    }

    // Mobile: optional, must be a valid 10-digit Indian number
    if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
      errors.push('Mobile number must be a valid 10-digit Indian number.');
    }

    // DOB: optional, must be valid and in the past
    if (dob && (!moment(dob, 'YYYY-MM-DD', true).isValid() || moment(dob).isAfter(moment()))) {
      errors.push('Date of birth must be a valid date in the past (YYYY-MM-DD).');
    }

    // Gender: optional, must be one of the allowed values
    const validGenders = ['Male', 'Female', 'Other'];
    if (gender && !validGenders.includes(gender)) {
      errors.push('Gender must be Male, Female, or Other.');
    }

    // City: optional, string, max 100 chars
    if (city && (typeof city !== 'string' || city.trim().length > 100)) {
      errors.push('City must be a string and max 100 characters.');
    }

    // Pincode: optional, must be 6 digits
    if (pincode && !/^\d{6}$/.test(pincode)) {
      errors.push('Pincode must be exactly 6 digits.');
    }

    // If validation fails, return errors
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // --- OPTIONAL: Sanitize inputs ---
    const clean = (val) => (typeof val === 'string' ? val.trim() : val);

    // Delete old image if new image uploaded
    if (req.file && req.user.image) {
      const oldImagePath = path.join(__dirname, '..', 'UserImage', req.user.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
    }

    // Call the stored procedure to update the user
    await pool.execute('CALL UpdateUser(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      id,
      clean(name) || null,
      image,
      update_user,
      clean(mobile) || null,
      dob || null,
      gender || null,
      clean(city) || null,
      clean(pincode) || null
    ]);

    // Fetch updated user data
    const [updatedRows] = await pool.execute('CALL GetUserById(?)', [id]);
    const updatedUser = updatedRows[0][0];

    console.log('User data updated:', updatedUser);

    res.json({ message: 'User updated successfully', user: updatedUser });

  } catch (err) {
    console.error('Error in updateUser:', err);
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
