// const pool = require('../config/db');


// exports.addSeatLayout = async (req, res) => {
//   try {
//     const { screen_id, seat_label } = req.body;
//     const currentUser = req.user?.email || 'admin_system';

//     if (!screen_id || !seat_label) {
//       return res.status(400).json({ message: 'Screen ID and seat label are required.' });
//     }

//     const [result] = await pool.execute(
//       'CALL AddSeatLayout(?, ?, ?)',
//       [screen_id, seat_label, currentUser]
//     );

//     res.status(201).json({ message: 'Seat layout added successfully', seatId: result[0][0].seat_id });
//   } catch (err) {
//     console.error('Error adding seat layout:', err);
//     res.status(500).json({ error: 'Failed to add seat layout: ' + err.message });
//   }
// };


// exports.bulkAddSeats = async (req, res) => {
//   const connection = await pool.getConnection();
//   try {
//     const { screen_id, seat_labels } = req.body;
//     const currentUser = req.user?.email || 'admin_system';

//     if (!screen_id || !Array.isArray(seat_labels) || seat_labels.length === 0) {
//       return res.status(400).json({ message: 'Screen ID and seat labels array are required.' });
//     }

//     await connection.beginTransaction();

//     for (const label of seat_labels) {
//       await connection.execute(
//         'CALL AddSeatLayout(?, ?, ?)',
//         [screen_id, label, currentUser]
//       );
//     }

//     await connection.commit();
//     res.status(201).json({ message: 'Bulk seat layouts added successfully' });
//   } catch (err) {
//     await connection.rollback();
//     console.error('Bulk seat layout error:', err);
//     res.status(500).json({ error: 'Failed to bulk add seats: ' + err.message });
//   } finally {
//     if (connection) connection.release();
//   }
// };


// exports.updateSeatLayout = async (req, res) => {
//   try {
//     const { id, screen_id, seat_label } = req.body;
//     const currentUser = req.user?.email || 'admin_system';

//     if (!id) return res.status(400).json({ message: 'Seat layout ID is required.' });

//     await pool.execute(
//       'CALL UpdateSeatLayout(?, ?, ?, ?)',
//       [id, screen_id || null, seat_label || null, currentUser]
//     );

//     res.json({ message: 'Seat layout updated successfully' });
//   } catch (err) {
//     console.error('Error updating seat layout:', err);
//     res.status(500).json({ error: 'Failed to update seat layout: ' + err.message });
//   }
// };


// exports.deleteSeatLayout = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Seat layout ID is required.' });

//     await pool.execute('CALL DeleteSeatLayout(?)', [id]);
//     res.json({ message: 'Seat layout deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting seat layout:', err);
//     res.status(500).json({ error: 'Failed to delete seat layout: ' + err.message });
//   }
// };


// exports.toggleSeatLayoutStatus = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Seat layout ID is required.' });

//     await pool.execute('CALL ToggleSeatLayoutStatus(?)', [id]);
//     res.json({ message: 'Seat layout status toggled successfully' });
//   } catch (err) {
//     console.error('Error toggling seat status:', err);
//     res.status(500).json({ error: 'Failed to toggle seat status: ' + err.message });
//   }
// };


// exports.getSeatLayoutById = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Seat layout ID is required.' });

//     const [rows] = await pool.execute('CALL GetSeatLayoutById(?)', [id]);
//     const seat = rows[0][0];

//     if (!seat) {
//       return res.status(404).json({ message: 'Seat layout not found.' });
//     }

//     res.json(seat);
//   } catch (err) {
//     console.error('Error fetching seat by ID:', err);
//     res.status(500).json({ error: 'Failed to get seat layout: ' + err.message });
//   }
// };


// exports.getAllSeatLayouts = async (req, res) => {
//   try {
//     const [rows] = await pool.execute('CALL GetAllSeatLayouts()');
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error fetching all seats:', err);
//     res.status(500).json({ error: 'Failed to get seat layouts: ' + err.message });
//   }
// };


// exports.getSeatsByScreenId = async (req, res) => {
//   try {
//     const { screen_id } = req.body;
//     if (!screen_id) return res.status(400).json({ message: 'Screen ID is required.' });

//     const [rows] = await pool.execute('CALL GetSeatsByScreenId(?)', [screen_id]);
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error fetching seats by screen:', err);
//     res.status(500).json({ error: 'Failed to get seats: ' + err.message });
//   }
// };

const pool = require('../config/db');

// Add single seat using stored procedure
exports.addSeatLayout = async (req, res) => {
  try {
    const { screen_id, seat_label, seat_type, position, row_char, col_number } = req.body;
    const currentUser = req.user?.email || 'admin_system';
    if (!screen_id || !seat_label || !seat_type) {
      return res.status(400).json({ message: 'Required fields missing.' });
    }
    const [result] = await pool.query(
      'CALL AddSeatLayout(?, ?, ?, ?, ?, ?, ?)',
      [screen_id, seat_label, seat_type, position || 'full', row_char || null, col_number || null, currentUser]
    );
    res.status(201).json({ message: 'Seat added successfully', seat_id: result.insertId });
  } catch (err) {
    console.error('Add Seat Error:', err);
    res.status(500).json({ error: 'Failed to add seat layout' });
  }
};

// Bulk Add Seats using stored procedure
exports.bulkAddSeats = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { screen_id, seats } = req.body;
    const currentUser = req.user?.email || 'admin_system';
    if (!screen_id || !Array.isArray(seats)) {
      return res.status(400).json({ message: 'Invalid screen ID or seats array' });
    }
    await connection.beginTransaction();
    for (const seat of seats) {
      const { seat_label, seat_type, position, row_char, col_number } = seat;
      await connection.query(
        'CALL AddSeatLayout(?, ?, ?, ?, ?, ?, ?)',
        [screen_id, seat_label, seat_type, position || 'full', row_char || null, col_number || null, currentUser]
      );
    }
    await connection.commit();
    res.status(201).json({ message: 'Bulk seats added successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Bulk Add Error:', err);
    res.status(500).json({ error: 'Bulk add failed' });
  } finally {
    connection.release();
  }
};

// Update seat layout using stored procedure
exports.updateSeatLayout = async (req, res) => {
  try {
    const { seat_id, screen_id, seat_label, seat_type, position, row_char, col_number } = req.body;
    const currentUser = req.user?.email || 'admin_system';
    if (!seat_id) return res.status(400).json({ message: 'Seat ID required' });
    await pool.query(
      'CALL UpdateSeatLayout(?, ?, ?, ?, ?, ?, ?, ?)',
      [seat_id, screen_id, seat_label, seat_type, position, row_char, col_number, currentUser]
    );
    res.json({ message: 'Seat updated successfully' });
  } catch (err) {
    console.error('Update Seat Error:', err);
    res.status(500).json({ error: 'Seat update failed' });
  }
};

// Delete seat using stored procedure
exports.deleteSeatLayout = async (req, res) => {
  try {
    const { seat_id } = req.body;
    if (!seat_id) return res.status(400).json({ message: 'Seat ID required' });
    await pool.query('CALL DeleteSeatLayout(?)', [seat_id]);
    res.json({ message: 'Seat deleted successfully' });
  } catch (err) {
    console.error('Delete Seat Error:', err);
    res.status(500).json({ error: 'Seat delete failed' });
  }
};

// Toggle seat status using stored procedure
exports.toggleSeatStatus = async (req, res) => {
  try {
    const { seat_id } = req.body;
    if (!seat_id) return res.status(400).json({ message: 'Seat ID required' });
    await pool.query('CALL ToggleSeatLayoutStatus(?)', [seat_id]);
    const [current] = await pool.query('SELECT status FROM tbl_seat_layout WHERE seat_id = ?', [seat_id]);
    const newStatus = current[0]?.status;
    res.json({ message: `Seat status changed to ${newStatus}` });
  } catch (err) {
    console.error('Toggle Seat Status Error:', err);
    res.status(500).json({ error: 'Toggle failed' });
  }
};

// Get seat by ID using stored procedure
exports.getSeatById = async (req, res) => {
  try {
    const { seat_id } = req.body;
    if (!seat_id) return res.status(400).json({ message: 'Seat ID required' });
    const [rows] = await pool.query('CALL GetSeatById(?)', [seat_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Seat not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get Seat Error:', err);
    res.status(500).json({ error: 'Failed to fetch seat' });
  }
};

// Get seats by screen using stored procedure
// Get seats by screen using the correct stored procedure name
exports.getSeatsByScreen = async (req, res) => {
  try {
    const { screen_id } = req.body;
    if (!screen_id) return res.status(400).json({ message: 'Screen ID required' });

    // Use the correct stored procedure name as specified
    const [rows] = await pool.query('CALL GetSeatsByScreenId(?)', [screen_id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Get Seats Error:', err);
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
};


// Get all seats using stored procedure
exports.getAllSeats = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL GetAllSeats()');
    res.json(rows[0]);
  } catch (err) {
    console.error('Get All Seats Error:', err);
    res.status(500).json({ error: 'Failed to fetch all seats' });
  }
};
