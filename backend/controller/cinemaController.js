const pool = require('../config/db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Helper function to send email
const sendManagerCredentials = async (email, password, cinemaName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Your Cinema Manager Credentials',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Cinema Management System</h2>
      <p>You have been registered as a manager for <strong>${cinemaName}</strong> cinema.</p>
      <p>Here are your login credentials:</p>
      <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; margin: 12px 0;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <div style="margin-top: 16px;">
        <p>Always keep this password safe and secure.</p>
      </div>
      <div style="margin-top: 24px; color: #6b7280;">
        <p>This message was sent automatically.&nbsp;<span style="display:none;">&zwnj;</span> For help, contact the system admin.</p>
      </div>
    </div>
  `,
};



    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

exports.addCinema = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name,
      address,
      city,
      state,
      zip_code,
      longitude,
      latitude,
      ownerId,
      manager_email
    } = req.body;

    const image = req.file?.filename || null;
    const create_user = req.user?.email || 'admin_system';

    if (!name || !address || !city || !state || !zip_code || !longitude || !latitude || !ownerId || !manager_email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate manager email already assigned to another cinema
    const [conflictManager] = await connection.execute(
      'SELECT cinema_id FROM tbl_cinema_manager WHERE email = ?',
      [manager_email]
    );

    if (conflictManager.length > 0) {
      return res.status(409).json({ message: 'Manager email is already used in another cinema' });
    }

    // Insert new cinema
    const [result] = await connection.execute(
      `INSERT INTO tbl_cinema 
        (owner_id, name, address, city, state, zip_code, longitude, latitude, image, create_user) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ownerId, name, address, city, state, zip_code, longitude, latitude, image, create_user]
    );

    const cinemaId = result.insertId;

    // Add manager
    const password = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      `INSERT INTO tbl_cinema_manager 
        (cinema_id, email, password, create_user) 
       VALUES (?, ?, ?, ?)`,
      [cinemaId, manager_email, hashedPassword, create_user]
    );

    await connection.commit();

    // Send manager credentials
    await sendManagerCredentials(manager_email, password, name);

    res.status(201).json({ message: 'Cinema added successfully', cinemaId });
  } catch (err) {
    await connection.rollback();
    console.error('❌ Error in addCinema:', err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};


exports.updateCinema = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      id,
      name,
      address,
      city,
      state,
      zip_code,
      longitude,
      latitude,
      ownerId,
      manager_email
    } = req.body;

    if (!id) return res.status(400).json({ message: 'Cinema ID is required' });

    const update_user = req.user?.email || 'admin_system';

    const [existingCinema] = await connection.execute(
      'SELECT image FROM tbl_cinema WHERE cinema_id = ?',
      [id]
    );
    if (existingCinema.length === 0) {
      return res.status(404).json({ message: 'Cinema not found' });
    }

    const image = req.file?.filename || existingCinema[0].image;

    // Update cinema
    await connection.execute(
      `UPDATE tbl_cinema 
       SET name = ?, address = ?, city = ?, state = ?, zip_code = ?, longitude = ?, latitude = ?, 
           image = ?, owner_id = ?, update_user = ?, updated_at = CURRENT_TIMESTAMP
       WHERE cinema_id = ?`,
      [name, address, city, state, zip_code, longitude, latitude, image, ownerId, update_user, id]
    );

    // Manager update
    if (manager_email) {
      const [currentManager] = await connection.execute(
        'SELECT email FROM tbl_cinema_manager WHERE cinema_id = ?',
        [id]
      );
      const currentEmail = currentManager[0]?.email;

      if (manager_email !== currentEmail) {
        const [conflict] = await connection.execute(
          'SELECT cinema_id FROM tbl_cinema_manager WHERE email = ? AND cinema_id != ?',
          [manager_email, id]
        );
        if (conflict.length > 0) {
          return res.status(409).json({ message: 'Manager email is already assigned to another cinema' });
        }

        // Delete old manager if exists
        if (currentEmail) {
          await connection.execute(
            'DELETE FROM tbl_cinema_manager WHERE cinema_id = ?',
            [id]
          );
        }

        const password = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
          `INSERT INTO tbl_cinema_manager (cinema_id, email, password, create_user)
           VALUES (?, ?, ?, ?)`,
          [id, manager_email, hashedPassword, update_user]
        );

        await connection.commit();

        await sendManagerCredentials(manager_email, password, name);

        return res.status(200).json({ message: 'Cinema and manager updated successfully' });
      }
    }

    await connection.commit();
    res.status(200).json({ message: 'Cinema updated successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('❌ Error in updateCinema:', err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};




exports.deleteCinema = async (req, res) => {
  const transaction = await pool.getConnection();
  try {
    await transaction.beginTransaction();

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Cinema ID is required' });
    }

    // Get cinema image path before deletion
    const [cinema] = await transaction.execute(
      'SELECT image FROM tbl_cinema WHERE cinema_id = ?',
      [id]
    );

    // Delete cinema
    await transaction.execute('CALL DeleteCinema(?)', [id]);

    // Delete associated image file if exists
    if (cinema[0]?.image) {
      const imagePath = path.join(__dirname, '../public/CinemaImage', cinema[0].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await transaction.commit();
    res.json({ message: 'Cinema deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error in deleteCinema:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (transaction) transaction.release();
  }
};

exports.getCinemaById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Cinema ID is required' });
    }

    const [cinema] = await pool.execute(
      `SELECT c.*, o.name as owner_name, 
      (SELECT email FROM tbl_cinema_manager WHERE cinema_id = c.cinema_id LIMIT 1) as manager_email
      FROM tbl_cinema c
      JOIN tbl_cinema_owner o ON c.owner_id = o.owner_id
      WHERE c.cinema_id = ?`,
      [id]
    );

    if (cinema.length === 0) {
      return res.status(404).json({ message: 'Cinema not found' });
    }

    res.json(cinema[0]);
  } catch (error) {
    console.error('Error in getCinemaById:', error);
    res.status(500).json({ error: error.message });
  }
};

// exports.toggleCinemaStatus = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) {
//       return res.status(400).json({ message: 'Cinema ID is required' });
//     }

//     const update_user = req.user?.email || 'system_admin';

//     await pool.execute('CALL ToggleCinemaStatus(?, ?)', [id, update_user]);
//     res.json({ message: 'Cinema status toggled successfully' });
//   } catch (error) {
//     console.error('Error in toggleCinemaStatus:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.toggleCinemaStatus = async (req, res) => {
//   const connection = await pool.getConnection(); 
//   try {
//     await connection.beginTransaction(); 

//     const { id } = req.body;
//     if (!id) {
//       return res.status(400).json({ message: 'Cinema ID is required' });
//     }

//     const update_user = req.user?.email || 'system_admin';

    
//     const [currentStatusRows] = await connection.execute(
//       'SELECT status FROM tbl_cinema WHERE cinema_id = ?',
//       [id]
//     );

//     if (currentStatusRows.length === 0) {
//       await connection.rollback(); 
//       return res.status(404).json({ message: 'Cinema not found' });
//     }

//     const currentStatus = currentStatusRows[0].status;
//     const newStatus = currentStatus === 1 ? 0 : 1; 

  
//     await connection.execute(
//       `UPDATE tbl_cinema 
//        SET status = ?, update_user = ?, updated_at = CURRENT_TIMESTAMP
//        WHERE cinema_id = ?`,
//       [newStatus, update_user, id]
//     );

//     await connection.commit(); 
//     res.json({ message: 'Cinema status toggled successfully' });
//   } catch (error) {
//     await connection.rollback(); 
//     console.error('Error in toggleCinemaStatus:', error);
//     res.status(500).json({ error: error.message });
//   } finally {
//     connection.release(); 
//   }
// };


exports.toggleCinemaStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Cinema ID is required' });
    }

    const update_user = req.user?.email || 'system_admin';
    await pool.execute('CALL ToggleCinemaStatus(?, ?)', [id, update_user]);

    res.json({ message: 'Cinema status toggled successfully' });
  } catch (error) {
    console.error('Error in toggleCinemaStatus:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.bulkAddCinemas = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Parse bulk_count from form data
    const bulkCount = parseInt(req.body.bulk_count) || 1;
    const create_user = req.user?.email || 'admin_system';
    const addedCinemas = [];
    const emailsToSend = [];

    for (let i = 0; i < bulkCount; i++) {
      // Handle both prefixed and non-prefixed fields
      const name = req.body[`name_${i}`] || req.body.name;
      const address = req.body[`address_${i}`] || req.body.address;
      const city = req.body[`city_${i}`] || req.body.city;
      const state = req.body[`state_${i}`] || req.body.state;
      const zip_code = req.body[`zip_code_${i}`] || req.body.zip_code;
      const longitude = req.body[`longitude_${i}`] || req.body.longitude;
      const latitude = req.body[`latitude_${i}`] || req.body.latitude;
      const ownerId = req.body[`owner_id_${i}`] || req.body.ownerId || req.body.owner_id;
      const manager_email = req.body[`manager_email_${i}`] || req.body.manager_email;

      // Find the correct image file
      let imageFile = req.files?.find(f => 
        f.fieldname === `image_${i}` || 
        (i === 0 && f.fieldname === 'image')
      )?.filename || null;

      // Validate required fields
      if (!name || !address || !city || !state || !zip_code || 
          !longitude || !latitude || !ownerId || !manager_email) {
        throw new Error(`Missing required fields for cinema ${i + 1}`);
      }

      // Check manager conflict
      const [conflict] = await connection.execute(
        'SELECT cinema_id FROM tbl_cinema_manager WHERE email = ?',
        [manager_email]
      );
      if (conflict.length > 0) {
        throw new Error(`Manager email "${manager_email}" is already assigned to another cinema`);
      }

      // Insert cinema
      const [result] = await connection.execute(
        `INSERT INTO tbl_cinema 
          (owner_id, name, address, city, state, zip_code, longitude, latitude, image, create_user)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ownerId, name, address, city, state, zip_code, longitude, latitude, imageFile, create_user]
      );

      const cinemaId = result.insertId;

      // Create manager
      const password = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.execute(
        'INSERT INTO tbl_cinema_manager (cinema_id, email, password, create_user) VALUES (?, ?, ?, ?)',
        [cinemaId, manager_email, hashedPassword, create_user]
      );

      emailsToSend.push({ email: manager_email, password, cinemaName: name });
      addedCinemas.push({ cinemaId, name });
    }

    await connection.commit();

    // Send emails after successful transaction
    for (const { email, password, cinemaName } of emailsToSend) {
      try {
        await sendManagerCredentials(email, password, cinemaName);
      } catch (err) {
        console.error(`Failed to send credentials to ${email}:`, err);
      }
    }

    res.status(201).json({
      message: `${addedCinemas.length} cinemas added successfully`,
      cinemas: addedCinemas
    });
  } catch (err) {
    await connection.rollback();
    console.error('❌ Error in bulkAddCinemas:', err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};


// exports.getCinemasByOwner = async (req, res) => {
//   try {
//     const { ownerId } = req.body;
//     if (!ownerId) {
//       return res.status(400).json({ message: 'Owner ID is required' });
//     }

//     const [cinemas] = await pool.execute(
//       `SELECT c.*, o.name as owner_name, 
//       (SELECT email FROM tbl_cinema_manager WHERE cinema_id = c.cinema_id LIMIT 1) as manager_email
//       FROM tbl_cinema c
//       JOIN tbl_cinema_owner o ON c.owner_id = o.owner_id
//       WHERE c.owner_id = ?`,
//       [ownerId]
//     );

//     res.json(cinemas);
//   } catch (error) {
//     console.error('Error in getCinemasByOwner:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getCinemasByOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;
    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }

    const [rows] = await pool.execute('CALL GetCinemasByOwner(?)', [ownerId]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error in getCinemasByOwner:', error);
    res.status(500).json({ error: error.message });
  }
};



// exports.getAllCinemas = async (req, res) => {
//   try {
//     const [cinemas] = await pool.execute(
//       `SELECT c.*, o.name as owner_name, 
//       (SELECT email FROM tbl_cinema_manager WHERE cinema_id = c.cinema_id LIMIT 1) as manager_email
//       FROM tbl_cinema c
//       JOIN tbl_cinema_owner o ON c.owner_id = o.owner_id`
//     );
//     res.json(cinemas);
//   } catch (error) {
//     console.error('Error in getAllCinemas:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllCinemas = async (req, res) => {
  try {
    const [rows] = await pool.execute('CALL GetAllCinemas()');
    res.json(rows[0]);
  } catch (error) {
    console.error('Error in getAllCinemas:', error);
    res.status(500).json({ error: error.message });
  }
};




exports.getFilteredCinemasData = async (req, res) => {
  try {
    const { movieId, city, date } = req.query;

    // 1. Fetch all cinemas
    const [cinemas] = await pool.execute('CALL GetAllCinemas()');

    // 2. Fetch all active movies (now playing + upcoming)
    const [nowPlayingMovies] = await pool.execute('CALL GetActiveNowPlayingMovies()');
    const [upcomingMovies] = await pool.execute('CALL GetActiveUpcomingMovies()');
    const allMovies = [...nowPlayingMovies[0], ...upcomingMovies[0]];

    // 3. Prepare showtimes with seat prices
    const showtimesByCinema = {};

    if (movieId && date) {
      for (const cinema of cinemas[0]) {
        const [rows] = await pool.execute(`
          SELECT 
            st.showtime_id,
            st.show_date,
            st.show_time,
            scr.screen_id,
            scr.screen_name,
            c.cinema_id,
            c.name AS cinema_name,
            m.title AS movie_title,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'seat_type', stp.seat_type,
                'price', stp.price
              )
            ) AS seat_type_prices
          FROM tbl_showtime st
          JOIN tbl_screen scr ON st.screen_id = scr.screen_id
          JOIN tbl_cinema c ON scr.cinema_id = c.cinema_id
          JOIN tbl_movie m ON st.movie_id = m.movie_id
          LEFT JOIN tbl_showtime_seat_type_price stp ON st.showtime_id = stp.showtime_id
          WHERE st.movie_id = ? AND c.cinema_id = ? AND st.show_date = ? AND st.status = 'Active'
          GROUP BY st.showtime_id
          ORDER BY st.show_time ASC
        `, [movieId, cinema.cinema_id, date]);

        showtimesByCinema[cinema.cinema_id] = rows;
      }
    }

    res.json({
      cinemas: cinemas[0],
      movies: allMovies,
      showtimesByCinema
    });
  } catch (err) {
    console.error('Error fetching filtered cinemas data:', err);
    res.status(500).json({ error: 'Failed to retrieve filtered cinemas data: ' + err.message });
  }
};