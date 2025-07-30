// const pool = require('../config/db');


// exports.addShowtime = async (req, res) => {
//   try {
//     const { movie_id, screen_id, show_date, show_time, price } = req.body;
//     const currentUser = req.user?.email || 'admin_system';

//     if (!movie_id || !screen_id || !show_date || !show_time || !price) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const [result] = await pool.execute(
//       'CALL AddShowtime(?, ?, ?, ?, ?, ?)',
//       [movie_id, screen_id, show_date, show_time, price, currentUser]
//     );

//     res.status(201).json({ message: 'Showtime added successfully', showtimeId: result[0][0].showtime_id });
//   } catch (err) {
//     console.error('Error adding showtime:', err);
//     res.status(500).json({ error: 'Failed to add showtime: ' + err.message });
//   }
// };


// exports.updateShowtime = async (req, res) => {
//   try {
//     const { id, movie_id, screen_id, show_date, show_time, price } = req.body;
//     const currentUser = req.user?.email || 'admin_system';

//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

//     await pool.execute(
//       'CALL UpdateShowtime(?, ?, ?, ?, ?, ?, ?)',
//       [id, movie_id || null, screen_id || null, show_date || null, show_time || null, price || null, currentUser]
//     );

//     res.json({ message: 'Showtime updated successfully' });
//   } catch (err) {
//     console.error('Error updating showtime:', err);
//     res.status(500).json({ error: 'Failed to update showtime: ' + err.message });
//   }
// };


// exports.deleteShowtime = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

//     await pool.execute('CALL DeleteShowtime(?)', [id]);
//     res.json({ message: 'Showtime deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting showtime:', err);
//     res.status(500).json({ error: 'Failed to delete showtime: ' + err.message });
//   }
// };


// exports.toggleShowtimeStatus = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

//     await pool.execute('CALL ToggleShowtimeStatus(?)', [id]);
//     res.json({ message: 'Showtime status toggled successfully' });
//   } catch (err) {
//     console.error('Error toggling showtime status:', err);
//     res.status(500).json({ error: 'Failed to toggle showtime status: ' + err.message });
//   }
// };


// exports.getShowtimeById = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

//     const [rows] = await pool.execute('CALL GetShowtimeById(?)', [id]);
//     const showtime = rows[0][0];

//     if (!showtime) {
//       return res.status(404).json({ message: 'Showtime not found.' });
//     }

//     res.json(showtime);
//   } catch (err) {
//     console.error('Error retrieving showtime:', err);
//     res.status(500).json({ error: 'Failed to retrieve showtime: ' + err.message });
//   }
// };


// exports.getShowtimesByMovieAndCinema = async (req, res) => {
//   try {
//     const { movie_id, cinema_id, show_date } = req.body;

//     if (!movie_id || !cinema_id || !show_date) {
//       return res.status(400).json({ message: 'Movie ID, Cinema ID, and Show Date are required.' });
//     }

//     const [rows] = await pool.execute(
//       'CALL GetShowtimesByMovieAndCinema(?, ?, ?)',
//       [movie_id, cinema_id, show_date]
//     );

//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error filtering showtimes:', err);
//     res.status(500).json({ error: 'Failed to retrieve showtimes: ' + err.message });
//   }
// };


// exports.getAllShowtimes = async (req, res) => {
//   try {
//     const [rows] = await pool.execute('CALL GetAllShowtimes()');
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error fetching all showtimes:', err);
//     res.status(500).json({ error: 'Failed to retrieve all showtimes: ' + err.message });
//   }
// };


// exports.getBookedSeatsForShowtime = async (req, res) => {
//     const { showtime_id } = req.body;

//     if (!showtime_id) {
//         return res.status(400).json({ message: 'Showtime ID is required.' });
//     }

//     try {
//         const [rows] = await pool.execute('CALL GetBookedSeatsForShowtime(?)', [showtime_id]);

//         const bookedSeats = rows[0]; 

//         res.status(200).json(bookedSeats);
//     } catch (error) {
//         console.error(`Error fetching booked seats for showtime ${showtime_id}:`, error);
//         res.status(500).json({
//             message: 'Server error: Unable to retrieve booked seats.',
//             error: error.message
//         });
//     }
// };

const pool = require('../config/db');

exports.addShowtime = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { movie_id, screen_id, show_date, show_time, prices } = req.body;
        const currentUser = req.user?.email || 'admin_system';

        if (!movie_id || !screen_id || !show_date || !show_time || !Array.isArray(prices) || prices.length === 0) {
            return res.status(400).json({ message: 'All fields and at least one seat type price are required.' });
        }

        // Convert prices array to JSON string for the stored procedure
        const pricesJson = JSON.stringify(prices);

        // Call the stored procedure
        const [result] = await connection.execute(
            'CALL AddShowtime(?, ?, ?, ?, ?, ?)',
            [movie_id, screen_id, show_date, show_time, currentUser, pricesJson]
        );

        // The stored procedure returns the showtime_id
        const showtimeId = result[0][0].showtime_id;

        res.status(201).json({ message: 'Showtime added successfully', showtimeId });
    } catch (err) {
        console.error('Error adding showtime:', err);
        // Stored procedure handles transactions, no explicit rollback needed here unless calling multiple SPs
        res.status(500).json({ error: 'Failed to add showtime: ' + err.message });
    } finally {
        connection.release();
    }
};

// Update Showtime
exports.updateShowtime = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id, movie_id, screen_id, show_date, show_time, prices } = req.body;
        const currentUser = req.user?.email || 'admin_system';

        if (!id) {
            return res.status(400).json({ message: 'Showtime ID is required.' });
        }
        if (!Array.isArray(prices) || prices.length === 0) {
            return res.status(400).json({ message: 'At least one seat type price is required for update.' });
        }

        const pricesJson = JSON.stringify(prices);

        // Call the stored procedure
        await connection.execute(
            'CALL UpdateShowtime(?, ?, ?, ?, ?, ?, ?)',
            [id, movie_id, screen_id, show_date, show_time, pricesJson, currentUser]
        );

        res.json({ message: 'Showtime updated successfully' });
    } catch (err) {
        console.error('Error updating showtime:', err);
        res.status(500).json({ error: 'Failed to update showtime: ' + err.message });
    } finally {
        connection.release();
    }
};



// Delete Showtime
exports.deleteShowtime = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

        // Call the stored procedure
        await connection.execute('CALL DeleteShowtime(?)', [id]);
        res.json({ message: 'Showtime deleted successfully' });
    } catch (err) {
        console.error('Error deleting showtime:', err);
        return res.status(500).json({
            error: 'Failed to delete showtime',
            sqlMessage: err.sqlMessage || err.message,
            code: err.code,
        });
    } finally {
        connection.release();
    }
};

// Toggle Showtime Status
exports.toggleShowtimeStatus = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

        // Call the stored procedure
        const [result] = await pool.execute('CALL ToggleShowtimeStatus(?)', [id]);
        const newStatus = result[0][0].new_status; // Assuming SP returns new_status

        res.json({ message: `Showtime status set to ${newStatus}` });
    } catch (err) {
        console.error('Error toggling showtime status:', err);
        res.status(500).json({ error: 'Failed to toggle showtime status: ' + err.message });
    }
};

// Update Showtime
// exports.updateShowtime = async (req, res) => {
//   try {
//     const { id, movie_id, screen_id, show_date, show_time } = req.body;
//     const currentUser = req.user?.email || 'admin_system';

//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

//     await pool.execute(
//       `UPDATE tbl_showtime
//        SET movie_id = ?, screen_id = ?, show_date = ?, show_time = ?, update_user = ?, updated_at = CURRENT_TIMESTAMP
//        WHERE showtime_id = ?`,
//       [movie_id, screen_id, show_date, show_time, currentUser, id]
//     );

//     res.json({ message: 'Showtime updated successfully' });
//   } catch (err) {
//     console.error('Error updating showtime:', err);
//     res.status(500).json({ error: 'Failed to update showtime: ' + err.message });
//   }
// };
// exports.updateShowtime = async (req, res) => {

//   const connection = await pool.getConnection();

//   try {

//     const { id, movie_id, screen_id, show_date, show_time, prices } = req.body;

//     const currentUser = req.user?.email || 'admin_system';
 
//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });
 
//     await connection.beginTransaction();
 
//     // Update main showtime table

//     await connection.execute(

//       `UPDATE tbl_showtime

//        SET movie_id = ?, screen_id = ?, show_date = ?, show_time = ?, update_user = ?, updated_at = CURRENT_TIMESTAMP

//        WHERE showtime_id = ?`,

//       [movie_id, screen_id, show_date, show_time, currentUser, id]

//     );
 
//     // Loop through seat type prices

//     for (const item of prices) {

//       const { seat_type, price } = item;
 
//       // Check if seat_type already exists

//       const [[existing]] = await connection.execute(

//         `SELECT * FROM tbl_showtime_seat_type_price WHERE showtime_id = ? AND seat_type = ?`,

//         [id, seat_type]

//       );
 
//       if (existing) {

//         // Update existing seat_type price

//         await connection.execute(

//           `UPDATE tbl_showtime_seat_type_price SET price = ? WHERE showtime_id = ? AND seat_type = ?`,

//           [price, id, seat_type]

//         );

//       } else {

//         // Insert new seat_type price

//         await connection.execute(

//           `INSERT INTO tbl_showtime_seat_type_price (showtime_id, seat_type, price) VALUES (?, ?, ?)`,

//           [id, seat_type, price]

//         );

//       }

//     }
 
//     await connection.commit();

//     res.json({ message: 'Showtime updated successfully' });

//   } catch (err) {

//     await connection.rollback();

//     console.error('Error updating showtime:', err);

//     res.status(500).json({ error: 'Failed to update showtime: ' + err.message });

//   } finally {

//     connection.release();

//   }

// };

 

// Delete Showtime
// exports.deleteShowtime = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

//     await pool.execute(`DELETE FROM tbl_showtime WHERE showtime_id = ?`, [id]);
//     res.json({ message: 'Showtime deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting showtime:', err);
//     res.status(500).json({ error: 'Failed to delete showtime: ' + err.message });
//   }
// };

// Toggle Showtime Status
// exports.toggleShowtimeStatus = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

//     const [[row]] = await pool.execute(
//       `SELECT status FROM tbl_showtime WHERE showtime_id = ?`,
//       [id]
//     );

//     if (!row) return res.status(404).json({ message: 'Showtime not found' });

//     const newStatus = row.status === 'Active' ? 'Inactive' : 'Active';

//     await pool.execute(
//       `UPDATE tbl_showtime SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE showtime_id = ?`,
//       [newStatus, id]
//     );

//     res.json({ message: `Showtime status set to ${newStatus}` });
//   } catch (err) {
//     console.error('Error toggling showtime status:', err);
//     res.status(500).json({ error: 'Failed to toggle showtime status: ' + err.message });
//   }
// };

// Get Showtime by ID
// exports.getShowtimeById = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

//     const [[showtime]] = await pool.execute(
//       `SELECT * FROM tbl_showtime WHERE showtime_id = ?`,
//       [id]
//     );

//     if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

//     const [prices] = await pool.execute(
//       `SELECT seat_type, price FROM tbl_showtime_seat_type_price WHERE showtime_id = ?`,
//       [id]
//     );

//     res.json({ ...showtime, seat_type_prices: prices });
//   } catch (err) {
//     console.error('Error retrieving showtime:', err);
//     res.status(500).json({ error: 'Failed to retrieve showtime: ' + err.message });
//   }
// };
exports.getShowtimeById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Showtime ID is required.' });

        // Call the stored procedure
        const [results] = await pool.query('CALL GetShowtimeById(?)', [id]);

        const showtime = results[0][0]; // First result set contains showtime details
        const prices = results[1];      // Second result set contains prices

        if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

        res.json({ ...showtime, seat_type_prices: prices });
    } catch (err) {
        console.error('Error retrieving showtime:', err);
        res.status(500).json({ error: 'Failed to retrieve showtime: ' + err.message });
    }
};

// Filter Showtimes by Movie, Cinema, Date
exports.getShowtimesByMovieAndCinema = async (req, res) => {
    try {
        const { movie_id, cinema_id, show_date } = req.body;

        if (!movie_id || !cinema_id || !show_date) {
            return res.status(400).json({ message: 'Movie ID, Cinema ID, and Show Date are required.' });
        }

        // Call the stored procedure
        const [rows] = await pool.execute(
            'CALL GetShowtimesByMovieAndCinema(?, ?, ?)',
            [movie_id, cinema_id, show_date]
        );

        res.json(rows[0]); // Stored procedures return results in an array of arrays
    } catch (err) {
        console.error('Error filtering showtimes:', err);
        res.status(500).json({ error: 'Failed to retrieve showtimes: ' + err.message });
    }
};


// Get All Showtimes
// exports.getAllShowtimes = async (req, res) => {
//   try {
//     const [rows] = await pool.execute(`SELECT * FROM tbl_showtime`);
//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching all showtimes:', err);
//     res.status(500).json({ error: 'Failed to retrieve all showtimes: ' + err.message });
//   }
// };

exports.getAllShowtimes = async (req, res) => {
    try {
        // Call the stored procedure
        const [rows] = await pool.query('CALL GetAllShowtimes()');
        res.json(rows[0]); // Stored procedures return results in an array of arrays
    } catch (err) {
        console.error('Error fetching all showtimes:', err);
        res.status(500).json({ error: 'Failed to retrieve all showtimes: ' + err.message });
    }
};

exports.getShowtimesByFilter = async (req, res) => {
    try {
        const { movie_id, city, show_date } = req.body;

        if (!movie_id || !city || !show_date) {
            return res.status(400).json({ message: 'movie_id, city, and show_date are required.' });
        }

        const [rows] = await pool.query(
            'CALL GetShowtimesByFilter(?, ?, ?)',
            [movie_id, city, show_date]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching showtimes by filter:', err);
        res.status(500).json({ error: 'Failed to retrieve filtered showtimes: ' + err.message });
    }
};

// Get Booked Seats for a Showtime
exports.getBookedSeatsForShowtime = async (req, res) => {
    try {
        const { showtime_id } = req.body;

        if (!showtime_id) return res.status(400).json({ message: 'Showtime ID is required.' });

        // Call the stored procedure
        const [rows] = await pool.execute(
            'CALL GetBookedSeatsForShowtime(?)',
            [showtime_id]
        );

        res.status(200).json(rows[0]); // Stored procedures return results in an array of arrays
    } catch (err) {
        console.error('Error fetching booked seats:', err);
        res.status(500).json({ error: 'Failed to retrieve booked seats: ' + err.message });
    }
};






// exports.getShowtimesByCinemaId = async (req, res) => {
//   try {
//     const { cinema_id } = req.body;

//     if (!cinema_id) {
//       return res.status(400).json({ message: 'Cinema ID is required.' });
//     }

//     const [rows] = await pool.query(`
//       SELECT
//         s.showtime_id,
//         m.title AS movie_title,
//         s.movie_id,
//         sc.screen_name,
//         s.screen_id,
//         c.name AS cinema_name,
//         c.cinema_id,
//         DATE_FORMAT(s.show_date, '%Y-%m-%d') AS show_date,
//         TIME_FORMAT(s.show_time, '%H:%i') AS show_time,
//         s.status
//       FROM
//         tbl_showtime s
//       JOIN
//         tbl_movie m ON s.movie_id = m.movie_id
//       JOIN
//         tbl_screen sc ON s.screen_id = sc.screen_id
//       JOIN
//         tbl_cinema c ON sc.cinema_id = c.cinema_id
//       WHERE
//         c.cinema_id = ?
//       ORDER BY
//         s.showtime_id DESC
//     `, [cinema_id]);

//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching showtimes by cinema ID:', err);
//     res.status(500).json({ error: 'Failed to retrieve showtimes: ' + err.message });
//   }
// };
exports.getShowtimesByCinemaId = async (req, res) => {
    try {
        const { cinema_id } = req.body;

        if (!cinema_id) {
            return res.status(400).json({ message: 'Cinema ID is required.' });
        }

        // Call the stored procedure
        const [rows] = await pool.query(
            'CALL GetShowtimesByCinemaId(?)',
            [cinema_id]
        );

        res.json(rows[0]); // Stored procedures return results in an array of arrays
    } catch (err) {
        console.error('Error fetching showtimes by cinema ID:', err);
        res.status(500).json({ error: 'Failed to retrieve showtimes: ' + err.message });
    }
};

// Get Showtimes by Owner ID
exports.getShowtimesByOwnerId = async (req, res) => {
    try {
        const { owner_id } = req.body;

        if (!owner_id) {
            return res.status(400).json({ message: 'Owner ID is required.' });
        }

        // Call the stored procedure
        const [rows] = await pool.query(
            'CALL GetShowtimesByOwnerId(?)',
            [owner_id]
        );

        res.json(rows[0]); // Stored procedures return results in an array of arrays
    } catch (err) {
        console.error('Error fetching showtimes by owner ID:', err);
        res.status(500).json({ error: 'Failed to retrieve showtimes: ' + err.message });
    }
};

// Bulk Add Showtimes
exports.bulkAddShowtimes = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { showtimes, create_user } = req.body;
        const currentUser = create_user || req.user?.email || 'admin_system';

        if (!Array.isArray(showtimes) || showtimes.length === 0) {
            return res.status(400).json({ message: 'An array of showtimes is required.' });
        }

        await connection.beginTransaction();

        for (const showtime of showtimes) {
            const { movie_id, screen_id, show_date, show_time, prices } = showtime;

            if (!movie_id || !screen_id || !show_date || !show_time || !Array.isArray(prices) || prices.length === 0) {
                throw new Error('Each showtime must have all required fields and at least one price.');
            }

            const pricesJson = JSON.stringify(prices);

            // Call the AddShowtime stored procedure for each showtime
            await connection.execute(
                'CALL AddShowtime(?, ?, ?, ?, ?, ?)',
                [movie_id, screen_id, show_date, show_time, currentUser, pricesJson]
            );
        }

        await connection.commit();
        res.status(201).json({ message: `${showtimes.length} showtimes added successfully` });

    } catch (err) {
        await connection.rollback();
        console.error('Error bulk adding showtimes:', err);
        res.status(500).json({ error: 'Failed to bulk add showtimes: ' + err.message });
    } finally {
        connection.release();
    }
};
