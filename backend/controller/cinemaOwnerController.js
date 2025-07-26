// File: controller/cinemaOwnerController.js

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { name, email, contact, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file?.filename || null;
    const create_user = req.user?.email || email;

    const [check] = await pool.execute('CALL CheckCinemaOwnerEmail(?)', [email]);
    if (check[0].length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    await pool.execute(
      'CALL RegisterCinemaOwner(?, ?, ?, ?, ?, ?)',
      [name, email, contact, image, hashedPassword, create_user]
    );

    res.json({ message: 'Cinema owner registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute('CALL GetCinemaOwnerByEmail(?)', [email]);
    const owner = rows[0][0];

    if (!owner) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!owner.is_verified) {
      return res.status(403).json({ message: 'Account not verified. Please wait for admin approval.' });
    }

    if (owner.status !== 'Active') {
      return res.status(403).json({ message: 'Account is inactive. Please contact Admin.' });
    }

    const match = await bcrypt.compare(password, owner.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: owner.owner_id, email: owner.email });

    res.json({
      token,
      name: owner.name,
      email: owner.email,
      owner_id: owner.owner_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const update_user = req.user.email;

    await pool.execute('CALL ToggleCinemaOwnerStatus(?, ?)', [id, update_user]);

    res.json({ message: `Status toggled successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.toggleVerification = async (req, res) => {
  try {
    const { id } = req.body;
    const update_user = req.user.email;

    await pool.execute('CALL ToggleCinemaOwnerVerification(?, ?)', [id, update_user]);

    res.json({ message: `Verification status toggled successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllOwners = async (req, res) => {
  try {
    const [rows] = await pool.execute('CALL GetAllCinemaOwners()');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
