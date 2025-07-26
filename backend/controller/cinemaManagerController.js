const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

// Register Manager
exports.registerManager = async (req, res) => {
  try {
    const { email, password, cinema_id } = req.body;
    if (!email || !password || !cinema_id) {
      return res.status(400).json({ message: 'Email, Password and Cinema ID are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const create_user = req.user?.email || 'admin_system';

    const [check] = await pool.execute('CALL CheckCinemaManagerByEmail(?)', [email]);
    if (check[0].length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    await pool.execute('CALL RegisterCinemaManager(?, ?, ?, ?)', [
      cinema_id,
      email,
      hashedPassword,
      create_user
    ]);

    res.json({ message: 'Cinema manager registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Login Manager
exports.loginManager = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute('CALL GetCinemaManagerByEmail(?)', [email]);
    const manager = rows[0][0];

    if (!manager) return res.status(401).json({ message: 'Invalid credentials' });
    if (manager.status !== 'active') return res.status(403).json({ message: 'Account is inactive' });

    const match = await bcrypt.compare(password, manager.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: manager.manager_id, email: manager.email });

    res.json({
      token,
      email: manager.email,
      cinema_id: manager.cinema_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Toggle Manager Status
exports.toggleManagerStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const update_user = req.user?.email || 'admin_system';

    await pool.execute('CALL ToggleCinemaManagerStatus(?, ?)', [id, update_user]);

    res.json({ message: 'Manager status toggled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Managers
exports.getAllManagers = async (req, res) => {
  try {
    const [rows] = await pool.execute('CALL GetAllCinemaManagers()');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getManagersByOwner = async (req, res) => {
  const { owner_id } = req.body;
  if (!owner_id) {
    return res.status(400).json({ message: 'owner_id is required' });
  }

  try {
    const [rows] = await pool.execute('CALL GetCinemaManagersByOwner(?)', [owner_id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { recent_password, new_password } = req.body;
    const managerId = req.user.id;

    if (!recent_password || !new_password) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    // ✅ Replace stored procedure with a direct SELECT query
    const [rows] = await pool.execute(
      'SELECT password FROM tbl_cinema_manager WHERE manager_id = ?',
      [managerId]
    );

    const manager = rows[0];
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    const match = await bcrypt.compare(recent_password, manager.password);
    if (!match) return res.status(401).json({ message: 'Incorrect recent password' });

    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    const update_user = req.user.email;

    // ✅ Use existing stored procedure to update the password
    await pool.execute('CALL ChangeCinemaManagerPassword(?, ?, ?)', [
      managerId,
      hashedNewPassword,
      update_user,
    ]);

    res.json({ message: 'Password updated successfully' });

  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
