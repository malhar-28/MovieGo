const pool = require('../config/db');

// Admin: Add a new screen
exports.addScreen = async (req, res) => {
  try {
    const { cinema_id, screen_name, total_seats, screen_type } = req.body;
    const currentUser = req.user?.email || 'admin_system';

    if (!cinema_id || !screen_name || !total_seats) {
      return res.status(400).json({ message: 'Cinema ID, screen name, and total seats are required.' });
    }

    const [result] = await pool.execute(
      'CALL AddScreen(?, ?, ?, ?, ?)',
      [cinema_id, screen_name, total_seats, screen_type || null, currentUser]
    );

    res.status(201).json({ message: 'Screen added successfully', screenId: result[0][0]?.screen_id });
  } catch (err) {
    console.error('Error adding screen:', err);
    res.status(500).json({ error: 'Failed to add screen: ' + err.message });
  }
};

// Admin: Update screen details
exports.updateScreen = async (req, res) => {
  try {
    const { id, cinema_id, screen_name, total_seats, screen_type } = req.body;
    const currentUser = req.user?.email || 'admin_system';

    if (!id) return res.status(400).json({ message: 'Screen ID is required for update' });

    await pool.execute(
      'CALL UpdateScreen(?, ?, ?, ?, ?, ?)',
      [id, cinema_id || null, screen_name || null, total_seats || null, screen_type || null, currentUser]
    );

    res.json({ message: 'Screen updated successfully' });
  } catch (err) {
    console.error('Error updating screen:', err);
    res.status(500).json({ error: 'Failed to update screen: ' + err.message });
  }
};

// Admin: Delete screen 
exports.deleteScreen = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Screen ID is required for deletion' });

    await pool.execute('CALL DeleteScreen(?)', [id]);
    res.json({ message: 'Screen deleted successfully' });
  } catch (err) {
    console.error('Error deleting screen:', err);
    res.status(500).json({ error: 'Failed to delete screen: ' + err.message });
  }
};

// Admin: Toggle screen status
exports.toggleScreenStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Screen ID is required to toggle status' });

    await pool.execute('CALL ToggleScreenStatus(?)', [id]);
    res.json({ message: 'Screen status toggled successfully' });
  } catch (err) {
    console.error('Error toggling screen status:', err);
    res.status(500).json({ error: 'Failed to toggle screen status: ' + err.message });
  }
};

// Get screen by ID
exports.getScreenById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Screen ID is required' });

    const [rows] = await pool.execute('CALL GetScreenById(?)', [id]);
    const screen = rows[0][0];
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }
    res.json(screen);
  } catch (err) {
    console.error('Error retrieving screen:', err);
    res.status(500).json({ error: 'Failed to retrieve screen: ' + err.message });
  }
};

// Get all screens
exports.getAllScreens = async (req, res) => {
  try {
    const [rows] = await pool.execute('CALL GetAllScreens()');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error retrieving all screens:', err);
    res.status(500).json({ error: 'Failed to retrieve all screens: ' + err.message });
  }
};
// Admin/Owner: Get screens by cinema ID (without stored procedure)
exports.getScreensByCinemaId = async (req, res) => {
  try {
    const { cinema_id } = req.body;
    if (!cinema_id) {
      return res.status(400).json({ message: 'Cinema ID is required.' });
    }

    // Call the new stored procedure
    const [rows] = await pool.execute('CALL GetScreensByCinemaId(?)', [cinema_id]);

    // Stored procedures return results in an array of arrays, typically the first element
    // of the outer array contains the actual result set.
    res.json(rows[0]);
  } catch (err) {
    console.error('Error retrieving screens by cinema ID:', err);
    res.status(500).json({ error: 'Failed to retrieve screens: ' + err.message });
  }
};

// Admin/Owner: Get screens by owner ID (now using stored procedure)
exports.getScreensByOwnerId = async (req, res) => {
  try {
    const { owner_id } = req.body;

    if (!owner_id) {
      return res.status(400).json({ message: 'Owner ID is required.' });
    }

    // Call the new stored procedure
    const [rows] = await pool.execute('CALL GetScreensByOwnerId(?)', [owner_id]);

    // Stored procedures return results in an array of arrays, typically the first element
    // of the outer array contains the actual result set.
    res.json(rows[0]);
  } catch (err) {
    console.error('Error retrieving screens by owner ID:', err);
    res.status(500).json({ error: 'Failed to retrieve screens: ' + err.message });
  }
};
exports.bulkAddScreen = async (req, res) => {
    const { screens } = req.body; // Expect an array of screen objects
    const currentUser = req.user?.email || 'system_user'; // Get the current user from the token

    // 1. Validate Input
    if (!Array.isArray(screens) || screens.length === 0) {
        return res.status(400).json({ message: 'A non-empty array of screens is required.' });
    }

    // 2. Start a database transaction
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const results = [];
        for (let i = 0; i < screens.length; i++) {
            const screen = screens[i];
            const { cinema_id, screen_name, total_seats, screen_type } = screen;

            // 3. Validate each screen object
            if (!cinema_id || !screen_name || !total_seats) {
                // If any screen is invalid, rollback the transaction
                await connection.rollback();
                return res.status(400).json({
                    message: `Validation failed for Screen ${i + 1}. Cinema ID, screen name, and total seats are required.`
                });
            }

            // 4. Execute the stored procedure for each screen
            const [result] = await connection.execute(
                'CALL AddScreen(?, ?, ?, ?, ?)',
                [cinema_id, screen_name, total_seats, screen_type || null, currentUser]
            );

            const newScreenId = result[0][0]?.screen_id;
            if (!newScreenId) {
                throw new Error(`Failed to create Screen ${i + 1} and retrieve its ID.`);
            }
            results.push({ screen_id: newScreenId, screen_name });
        }

        // 5. Commit the transaction if all screens were added successfully
        await connection.commit();

        res.status(201).json({
            message: `${screens.length} screen(s) added successfully.`,
            createdScreens: results
        });

    } catch (err) {
        // 6. Rollback the transaction in case of any error
        await connection.rollback();
        console.error('Error in bulk-adding screens:', err);
        res.status(500).json({ error: 'Failed to add screens in bulk: ' + err.message });
    } finally {
        // 7. Release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};