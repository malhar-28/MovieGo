

// File: controller/bookingController.js
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const QRCode = require('qrcode');
const { sendEmail } = require('../utils/emailService');

// Helper function to extract user_id from token (Retained and necessary for new functionality)
const getUserIdFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.id; // Assuming your JWT payload has an 'id' field for user_id
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }
    return null;
};

// Helper to calculate total/final amount based on new pricing structure
const calculateAmounts = async (showtimeId, seatIds) => {
    let connection;
    try {
        connection = await pool.getConnection();

        // 1. Get seat types for the provided seat_ids from tbl_seat_layout
        const [seatLayoutRows] = await connection.execute(
            `SELECT seat_id, seat_type FROM tbl_seat_layout WHERE seat_id IN (${seatIds.map(() => '?').join(',')})`,
            seatIds
        );

        if (!seatLayoutRows || seatLayoutRows.length !== seatIds.length) {
            throw new Error('Some selected seats are invalid or not found in seat layout.');
        }

        const seatTypeMap = {};
        seatLayoutRows.forEach(seat => {
            seatTypeMap[seat.seat_id] = seat.seat_type;
        });

        // 2. Get showtime-specific prices for all seat types for this showtime
        const [showtimePricesRows] = await connection.execute(
            `SELECT seat_type, price FROM tbl_showtime_seat_type_price WHERE showtime_id = ?`,
            [showtimeId]
        );

        if (!showtimePricesRows || showtimePricesRows.length === 0) {
            throw new Error('Showtime pricing not configured for this showtime.');
        }

        const showtimePriceMap = {};
        showtimePricesRows.forEach(item => {
            showtimePriceMap[item.seat_type] = item.price;
        });

        let totalAmount = 0;
        for (const seatId of seatIds) {
            const seatType = seatTypeMap[seatId];
            if (!seatType) {
                throw new Error(`Seat ID ${seatId} has an unknown type.`);
            }
            const priceForSeatType = showtimePriceMap[seatType];
            if (typeof priceForSeatType === 'undefined' || priceForSeatType === null) {
                throw new Error(`Price for seat type '${seatType}' not found for this showtime.`);
            }
            totalAmount += parseFloat(priceForSeatType);
        }

        const discount = 0.00;
        const finalAmount = totalAmount - discount;
        return { totalAmount, discount, finalAmount };
    } catch (error) {
        console.error('Error calculating amounts:', error);
        throw new Error('Failed to calculate booking amounts: ' + error.message);
    } finally {
        if (connection) connection.release();
    }
};

// Helper to get detailed booking information for email
const getBookingDetails = async (bookingId, connection) => {
  const [bookingRows] = await connection.execute('CALL GetBookingById(?)', [bookingId]);

  if (bookingRows && bookingRows[0] && bookingRows[0].length > 0) {
    const bookingDetails = bookingRows[0][0];

    // 👇 New: Fetch user email by joining tbl_user
    const [userRows] = await connection.execute(
      `SELECT email FROM tbl_user WHERE id = ?`,
      [bookingDetails.user_id]
    );
    bookingDetails.user_email = userRows[0]?.email;

    // Fetch seat labels manually from tbl_seat_layout
    const [seatRows] = await connection.execute(
      `SELECT sl.seat_label 
       FROM tbl_booking_seat bs 
       JOIN tbl_seat_layout sl ON bs.seat_id = sl.seat_id 
       WHERE bs.booking_id = ?`,
      [bookingId]
    );

    bookingDetails.booked_seats_details = seatRows.map(s => ({ seat_label: s.seat_label }));

    return bookingDetails;
  }

  return null;
};



// Helper to generate HTML content for the booking confirmation email
const generateEmailContent = async (bookingDetails) => {
  if (!bookingDetails) {
    return '<h1>Booking Confirmation</h1><p>Details not available.</p>';
  }

  // Safely extract seat labels
  let seatLabels = [];
  try {
    if (Array.isArray(bookingDetails.booked_seats_details)) {
      seatLabels = bookingDetails.booked_seats_details.map(seat =>
        typeof seat === 'object' && seat !== null
          ? seat.seat_label || ''
          : seat
      );
    } else if (typeof bookingDetails.booked_seats_details === 'string') {
      const parsed = JSON.parse(bookingDetails.booked_seats_details);
      seatLabels = Array.isArray(parsed)
        ? parsed.map(seat =>
            typeof seat === 'object' && seat !== null
              ? seat.seat_label || ''
              : seat
          )
        : [];
    }
  } catch (err) {
    console.error('Error parsing seat labels:', err);
  }

  // Filter out empty strings or nulls
  seatLabels = seatLabels.filter(label => typeof label === 'string' && label.trim() !== '');

  console.log("✅ Extracted seatLabels for email:", seatLabels);

  // Format date and time properly
  const showDate = bookingDetails.show_date;
  const showTime = bookingDetails.show_time;
  const formattedDate = moment(showDate, 'YYYY-MM-DD').format('ddd, D MMM YYYY');
  const formattedTime = moment(showTime, ['HH:mm:ss', 'HH:mm']).isValid()
    ? moment(showTime, ['HH:mm:ss', 'HH:mm']).format('HH:mm') + ' WIB'
    : 'Invalid Time';

  // Poster & QR details
  const posterUrl = `http://localhost:5000/MovieImages/${bookingDetails.poster_image || 'placeholder.jpg'}`;
  const transactionCode = bookingDetails.booking_id?.toString().slice(-6) || 'N/A';
  const qrValue = JSON.stringify({ bookingId: bookingDetails.booking_id, transactionCode });

  let qrBase64 = '';
  try {
    qrBase64 = await QRCode.toDataURL(qrValue, { width: 100 });
  } catch (err) {
    console.error('QR Code generation failed:', err);
  }

  return `
  <div style="max-width:600px;margin:auto;background-color:#f9f9f9;border-radius:12px;font-family:Inter,sans-serif;overflow:hidden;border:1px solid #ddd;">
    <div style="background-color:#0B193F;color:white;padding:20px;text-align:center;">
      <h2 style="margin:0;">Your Ticket</h2>
    </div>

    <div style="padding:20px;background-color:white;">
      <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
        <img src="${posterUrl}" alt="${bookingDetails.movie_title}" style="width:60px;height:80px;object-fit:cover;border-radius:8px;margin-right:12px;" onerror="this.onerror=null;this.src='https://via.placeholder.com/60x80?text=No+Poster';" />
        <div>
          <p style="color:#3b82f6;font-size:12px;margin:0 0 6px;"><strong>Order ID:</strong> ${bookingDetails.booking_id}</p>
          <h3 style="margin:0 0 4px;color:#1f2937;">${bookingDetails.movie_title}</h3>
          <p style="margin:0;color:#6b7280;">${bookingDetails.cinema_name} • ${bookingDetails.screen_name}</p>
        </div>
      </div>

      <hr style="border:none;border-top:1px dashed #ccc;margin:16px 0;" />

      <table style="width:100%;font-size:14px;margin-bottom:16px;">
        <tr>
          <td><strong>Schedule:</strong><br>${formattedDate}</td>
          <td><strong>Time:</strong><br>${formattedTime}</td>
        </tr>
        <tr>
          <td style="padding-top:12px;"><strong>Seats:</strong><br>
            ${seatLabels.map(s => `<span style="display:inline-block;margin:2px;padding:4px 8px;background-color:#0B193F;color:white;border-radius:4px;font-size:12px;">${s}</span>`).join('')}
          </td>
          <td style="padding-top:12px;"><strong>Total Seats:</strong><br>${seatLabels.length}</td>
        </tr>
      </table>

      <hr style="border:none;border-top:1px dashed #ccc;margin:16px 0;" />

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <p style="color:#6b7280;font-size:12px;margin:0;">Transaction Code</p>
          <h2 style="margin:4px 0;color:#1f2937;letter-spacing:2px;">${transactionCode}</h2>
        </div>
        <div>
          <p style="color:#6b7280;font-size:12px;margin:0 0 4px;">QR Code</p>
          <img src="${qrBase64}" alt="QR Code" style="width:60px;height:60px;border:1px solid #ccc;padding:4px;border-radius:4px;background:white;" />
        </div>
      </div>

      <p style="text-align:center;margin-top:20px;color:#777;font-size:13px;">Thank you for booking with <strong>MovieGo</strong>!</p>
    </div>
  </div>
  `;
};









// User: Create a new booking
exports.createBooking = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const { showtime_id, seat_ids, payment_method } = req.body;
        const user_id = req.user.id;
        const create_user = req.user.email;

        const [userRows] = await connection.execute('SELECT email FROM tbl_user WHERE id = ?', [user_id]);
        const userEmail = userRows[0]?.email;

        if (!showtime_id || !seat_ids || !Array.isArray(seat_ids) || seat_ids.length === 0 || !payment_method) {
            return res.status(400).json({ message: 'Showtime ID, selected seat IDs (array), and payment method are required.' });
        }

        const [availableSeatsRows] = await connection.execute('CALL GetAvailableSeatsForShowtime(?)', [showtime_id]);
        const availableSeats = availableSeatsRows[0].map(seat => seat.seat_id);
        for (const selectedSeatId of seat_ids) {
            if (!availableSeats.includes(selectedSeatId)) {
                await connection.rollback();
                return res.status(409).json({ message: `Seat ID ${selectedSeatId} is not available or does not exist for this showtime.` });
            }
        }

        const { totalAmount, discount, finalAmount } = await calculateAmounts(showtime_id, seat_ids);

        const [result] = await connection.execute(
            'CALL AddBooking(?, ?, ?, ?, ?, ?, ?, ?)',
            [
                user_id,
                showtime_id,
                JSON.stringify(seat_ids),
                payment_method,
                totalAmount,
                discount,
                finalAmount,
                create_user
            ]
        );

        const bookingId = result[0][0].booking_id;

        // --- Email Sending Logic ---
        try {
            const bookingDetails = await getBookingDetails(bookingId, connection);
            console.log('bookingDetails for email:', bookingDetails);
            if (bookingDetails && userEmail) {
                const emailHtmlContent = await generateEmailContent(bookingDetails);
await sendEmail(userEmail, 'Your MovieGo Booking Confirmation', emailHtmlContent);
                console.log(`Booking confirmation email sent to ${userEmail} for booking ID ${bookingId}`);
            } else {
                console.warn(`Could not send email for booking ${bookingId}: Booking details or user email missing.`);
            }
        } catch (emailError) {
            console.error('Error sending booking confirmation email:', emailError);
        }

        await connection.commit();
        res.status(201).json({ message: 'Booking created successfully', bookingId: bookingId });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error creating booking:', err);
        if (err.message.includes('One or more selected seats are already booked')) {
            return res.status(409).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to create booking: ' + err.message });
    } finally {
        if (connection) connection.release();
    }
};


const getBookingDetailsForUserBookings = async (bookingId, connection) => {
    // This stored procedure should return all necessary details for the email,
    // including movie title, cinema name, screen name, show date/time, seat labels, etc.
    const [bookingRows] = await connection.execute('CALL GetBookingById(?)', [bookingId]);
    // Assuming GetBookingById returns an array of results, and the first element's first row is the booking.
    if (bookingRows && bookingRows[0] && bookingRows[0].length > 0) {
        return bookingRows[0][0];
    }
    return null;
};


// User: Get logged-in user's bookings (MODIFIED)
// User: Get logged-in user's bookings (MODIFIED)
exports.getUserBookings = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const user_id = req.user.id;

        const [rawBookingsResult] = await connection.execute('CALL GetBookingsByUserId(?)', [user_id]);
        const rawBookings = rawBookingsResult[0];

        const detailedBookings = [];

        for (const booking of rawBookings) {
            const showDateTime = moment(`${booking.show_date} ${booking.show_time}`, 'YYYY-MM-DD HH:mm:ss'); // ✅ Fixed parsing
            const currentTime = moment();
            const hoursDifference = showDateTime.diff(currentTime, 'hours');

            // ✅ FIX: Fetch seat_ids from tbl_booking_seat
            const [seatIdRows] = await connection.execute(
                `SELECT seat_id FROM tbl_booking_seat WHERE booking_id = ?`,
                [booking.booking_id]
            );
            const parsedSeatIds = seatIdRows.map(row => row.seat_id);

            let totalCalculatedAmount = 0;
            let seatDetails = [];

            if (parsedSeatIds.length > 0) {
                const [seatLayoutRows] = await connection.execute(
                    `SELECT seat_id, seat_type, row_char, col_number FROM tbl_seat_layout WHERE seat_id IN (${parsedSeatIds.map(() => '?').join(',')})`,
                    parsedSeatIds
                );

                const seatTypeMap = {};
                seatLayoutRows.forEach(seat => {
                    seatTypeMap[seat.seat_id] = {
                        seat_type: seat.seat_type,
                        row_char: seat.row_char,
                        col_number: seat.col_number
                    };
                });

                const [showtimePricesRows] = await connection.execute(
                    `SELECT seat_type, price FROM tbl_showtime_seat_type_price WHERE showtime_id = ?`,
                    [booking.showtime_id]
                );

                const showtimePriceMap = {};
                showtimePricesRows.forEach(item => {
                    showtimePriceMap[item.seat_type] = item.price;
                });

                for (const seatId of parsedSeatIds) {
                    const seatInfo = seatTypeMap[seatId];
                    if (seatInfo) {
                        const priceForSeatType = showtimePriceMap[seatInfo.seat_type];
                        if (typeof priceForSeatType !== 'undefined' && priceForSeatType !== null) {
                            totalCalculatedAmount += parseFloat(priceForSeatType);
                            seatDetails.push({
                                seat_id: seatId,
                                seat_type: seatInfo.seat_type,
                                row_char: seatInfo.row_char,
                                col_number: seatInfo.col_number,
                                price: parseFloat(priceForSeatType)
                            });
                        } else {
                            console.warn(`Price for seat type '${seatInfo.seat_type}' not found for showtime ${booking.showtime_id}.`);
                        }
                    } else {
                        console.warn(`Seat ID ${seatId} not found in seat layout for booking ${booking.booking_id}.`);
                    }
                }
            }

            detailedBookings.push({
                ...booking,
                total_amount_calculated: totalCalculatedAmount.toFixed(2),
                canCancel: hoursDifference > 1 && booking.booking_status === 'Confirmed',
                seats: seatDetails
            });
        }

        res.json(detailedBookings);
    } catch (err) {
        console.error('Error getting user bookings:', err);
        res.status(500).json({ error: 'Failed to retrieve user bookings: ' + err.message });
    } finally {
        if (connection) connection.release();
    }
};


// Admin: Get all bookings (Retained from your old controller)
exports.getAllBookings = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL GetAllBookings()');
        res.json(rows[0]);
    } catch (err) {
        console.error('Error getting all bookings (Admin):', err);
        res.status(500).json({ error: 'Failed to retrieve all bookings: ' + err.message });
    } finally {
        if (connection) connection.release();
    }
};

// Admin: Get booking by ID (Retained from your old controller)
// exports.getBookingByIdAdmin = async (req, res) => {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         const { id } = req.body;

//         if (!id) return res.status(400).json({ message: 'Booking ID is required' });

//         const [rows] = await connection.execute('CALL GetBookingById(?)', [id]);
//         const booking = rows[0][0];

//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found.' });
//         }
//         res.json(booking);
//     } catch (err) {
//         console.error('Error getting booking by ID (Admin):', err);
//         res.status(500).json({ error: 'Failed to retrieve booking: ' + err.message });
//     } finally {
//         if (connection) connection.release();
//     }
// };

exports.getBookingByIdAdmin = async (req, res) => {
    let connection; // Use connection for consistency in pool methods
    try {
        connection = await pool.getConnection(); // Get a connection
        const { id } = req.body; // Expects ID from body as per your route

        if (!id) return res.status(400).json({ message: 'Booking ID is required' });

        const [rows] = await connection.execute('CALL GetBookingById(?)', [id]);
        const booking = rows[0][0]; // Assuming SP returns single row in first result set

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.json(booking); // Retained from your old controller
    } catch (err) {
        console.error('Error getting booking by ID (Admin):', err);
        res.status(500).json({ error: 'Failed to retrieve booking: ' + err.message }); // Retained from old controller
    } finally {
        if (connection) connection.release(); // Release connection
    }
};

const generateCancellationEmailContent = (bookingDetails) => {
  if (!bookingDetails) {
    return '<h1>Booking Cancelled</h1><p>Details not available.</p>';
  }

//   const formattedDate = moment(bookingDetails.show_date).format('ddd, D MMM YYYY');
//   const formattedTime = moment(bookingDetails.show_time, 'HH:mm:ss').isValid()
//     ? moment(bookingDetails.show_time, 'HH:mm:ss').format('HH:mm') + ' WIB'
//     : 'Invalid Time';
const rawDate = bookingDetails.show_date;
const rawTime = bookingDetails.show_time;

// Convert both to strings in 'YYYY-MM-DD' and 'HH:mm:ss' formats (or assume so)
const showDate = moment(rawDate).format('YYYY-MM-DD');
const showTime = moment(rawTime, ['HH:mm:ss', 'HH:mm']).format('HH:mm:ss');

// Safely combine them
const showDateTime = moment(`${showDate} ${showTime}`, 'YYYY-MM-DD HH:mm:ss');

const formattedDate = showDateTime.format('ddd, D MMM YYYY');
const formattedTime = showDateTime.format('HH:mm') + ' WIB';


  return `
    <div style="max-width:600px;margin:auto;background-color:#f9f9f9;border-radius:12px;font-family:Inter,sans-serif;overflow:hidden;border:1px solid #ddd;">
      <div style="background-color:#b91c1c;color:white;padding:20px;text-align:center;">
        <h2 style="margin:0;">Booking Cancelled</h2>
      </div>

      <div style="padding:20px;background-color:white;">
        <p style="font-size:16px;color:#333;">Hello,</p>
        <p style="font-size:15px;">Your booking for <strong>${bookingDetails.movie_title}</strong> at <strong>${bookingDetails.cinema_name}</strong> on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong> has been <span style="color:#b91c1c;"><strong>cancelled</strong></span>.</p>

        <p style="margin-top:20px;">If you believe this was a mistake or need assistance, please contact MovieGo support.</p>

        <p style="margin-top:30px;font-size:14px;color:#777;">Thank you for using <strong>MovieGo</strong>.</p>
      </div>
    </div>
  `;
};


// Admin: Cancel a booking (soft delete by setting status to 'Cancelled') (Retained from your old controller)
// Admin: Cancel a booking (soft delete by setting status to 'Cancelled') (Retained from your old controller)
exports.cancelBooking = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Booking ID is required' });

        const update_user = req.user ? req.user.email : 'admin_system';

        // Get booking and showtime details
        const [bookingRows] = await connection.execute(
            `SELECT b.booking_id, s.show_date, s.show_time, b.booking_status
             FROM tbl_booking b
             JOIN tbl_showtime s ON b.showtime_id = s.showtime_id
             WHERE b.booking_id = ?`,
            [id]
        );

        if (bookingRows.length === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        const booking = bookingRows[0];
        if (booking.booking_status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled.' });
        }

        // const showDateTime = moment(`${booking.show_date}T${booking.show_time}`);
//         const showDate = moment(booking.show_date).format('YYYY-MM-DD');
// const showTime = moment(booking.show_time, ['HH:mm:ss', 'HH:mm']).format('HH:mm:ss');
// const showDateTime = moment(`${showDate} ${showTime}`, 'YYYY-MM-DD HH:mm:ss');
// ✅ Use show_date and show_time directly as strings
// Convert show_date to 'YYYY-MM-DD' format safely
// Safely extract date string in 'YYYY-MM-DD' format
const showDate = new Date(booking.show_date).toISOString().slice(0, 10); // --> '2025-07-19'


// Ensure show_time is properly formatted
// Format show_time safely
const showTime = moment(booking.show_time, ['HH:mm:ss', 'HH:mm']).format('HH:mm:ss');

// Combine properly
const showDateTime = moment(`${showDate} ${showTime}`, 'YYYY-MM-DD HH:mm:ss');

// Debug log
console.log('Parsed showDateTime:', showDateTime.format(), 'Current:', moment().format(), 'Diff (hours):', showDateTime.diff(moment(), 'hours'));



// ✅ Debug log to verify
console.log('Parsed showDateTime:', showDateTime.format(), 'Current:', moment().format(), 'Diff (hours):', showDateTime.diff(moment(), 'hours'));


        const currentTime = moment();
        const hoursDifference = showDateTime.diff(currentTime, 'hours');

        if (hoursDifference <= 1) {
            return res.status(400).json({
                message: 'Cannot cancel booking less than 1 hour before showtime'
            });
        }

        // Proceed with cancellation
        await connection.execute('CALL CancelBooking(?, ?)', [id, update_user]);

        // Send cancellation email
        try {
            const bookingDetails = await getBookingDetails(id, connection); // existing helper
            const userEmail = bookingDetails?.user_email;

            if (bookingDetails && userEmail) {
                const emailHtmlContent = generateCancellationEmailContent(bookingDetails);
                await sendEmail(userEmail, 'Your MovieGo Booking Has Been Cancelled', emailHtmlContent);
                console.log(`Cancellation email sent to ${userEmail} for booking ID ${id}`);
            } else {
                console.warn(`Could not send cancellation email for booking ${id}: Missing details.`);
            }
        } catch (emailError) {
            console.error('Error sending cancellation email:', emailError);
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Failed to cancel booking: ' + err.message });
    } finally {
        if (connection) connection.release();
    }
};


// Get Showtime Seat Status (Adjusted to only return what is currently used in the response)
exports.getShowtimeSeatStatus = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { showtimeId } = req.params;
        const userId = req.user.id;

        console.log('Showtime ID:', showtimeId);
        console.log('User ID:', userId);

        if (!showtimeId || !userId) {
            return res.status(400).json({ message: 'Showtime ID and User ID are required.' });
        }

        // Step 1: Call GetBookedSeatsForShowtime (your existing procedure)
        const [allBookedSeatsResult] = await connection.execute(
            `CALL GetBookedSeatsForShowtime(?)`,
            [showtimeId]
        );
        const allBookedSeats = allBookedSeatsResult[0];

        console.log('All Booked Seats:', allBookedSeats);

        res.status(200).json(allBookedSeats);

    } catch (error) {
        console.error('Error fetching showtime seat status:', error);
        res.status(500).json({ error: 'Failed to fetch showtime seat status: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
};





// exports.getBookingByCinemaIdAdmin = async (req, res) => {
//   try {
//     const { cinema_id } = req.body;

//     if (!cinema_id) {
//       return res.status(400).json({ message: 'Cinema ID is required' });
//     }

//     const [bookings] = await pool.query(`
//       SELECT
//         b.booking_id,
//         MAX(b.booking_status) AS booking_status,
//         MAX(b.created_at) AS created_at,
//         MAX(b.update_user) AS update_user,
//         MAX(b.updated_at) AS updated_at,
//         MAX(b.status) AS status,
//         MAX(u.id) AS user_id,
//         MAX(u.name) AS user_name,
//         MAX(u.email) AS user_email,
//         MAX(st.showtime_id) AS showtime_id,
//         MAX(st.show_date) AS show_date,
//         MAX(st.show_time) AS show_time,
//         MAX(sl.seat_type) AS seat_type,
//         MAX(stp.price) AS seat_price,
//         MAX(m.movie_id) AS movie_id,
//         MAX(m.title) AS movie_title,
//         MAX(m.poster_image) AS poster_image,
//         MAX(scr.screen_id) AS screen_id,
//         MAX(scr.screen_name) AS screen_name,
//         MAX(cin.cinema_id) AS cinema_id,
//         MAX(cin.name) AS cinema_name,
//         MAX(os.order_id) AS order_id,
//         MAX(os.payment_method) AS payment_method,
//         MAX(os.total_amount) AS total_amount,
//         MAX(os.discount) AS discount,
//         MAX(os.final_amount) AS final_amount,
//         GROUP_CONCAT(DISTINCT sl.seat_label ORDER BY sl.seat_label SEPARATOR ', ') AS seat_labels
//       FROM tbl_booking b
//       JOIN tbl_user u ON b.user_id = u.id
//       JOIN tbl_showtime st ON b.showtime_id = st.showtime_id
//       JOIN tbl_movie m ON st.movie_id = m.movie_id
//       JOIN tbl_screen scr ON st.screen_id = scr.screen_id
//       JOIN tbl_cinema cin ON scr.cinema_id = cin.cinema_id
//       LEFT JOIN tbl_order_summary os ON b.booking_id = os.booking_id
//       LEFT JOIN tbl_booking_seat bseat ON b.booking_id = bseat.booking_id
//       LEFT JOIN tbl_seat_layout sl ON bseat.seat_id = sl.seat_id
//       LEFT JOIN tbl_showtime_seat_type_price stp ON 
//         st.showtime_id = stp.showtime_id AND 
//         sl.seat_type = stp.seat_type
//       WHERE cin.cinema_id = ?
//       GROUP BY b.booking_id
//       ORDER BY b.booking_id DESC
//     `, [cinema_id]);

//     res.json(bookings);
//   } catch (err) {
//     console.error('Error fetching bookings by cinema ID:', err);
//     res.status(500).json({ error: 'Failed to retrieve bookings: ' + err.message });
//   }
// };


// exports.getBookingByOwnerIdAdmin = async (req, res) => {
//   try {
//     const { owner_id } = req.body;

//     if (!owner_id) {
//       return res.status(400).json({ message: 'Owner ID is required' });
//     }

//     const [bookings] = await pool.query(`
//       SELECT
//         b.booking_id,
//         MAX(b.booking_status) AS booking_status,
//         MAX(b.created_at) AS created_at,
//         MAX(b.update_user) AS update_user,
//         MAX(b.updated_at) AS updated_at,
//         MAX(b.status) AS status,
//         MAX(u.id) AS user_id,
//         MAX(u.name) AS user_name,
//         MAX(u.email) AS user_email,
//         MAX(st.showtime_id) AS showtime_id,
//         MAX(st.show_date) AS show_date,
//         MAX(st.show_time) AS show_time,
//         MAX(sl.seat_type) AS seat_type,
//         MAX(stp.price) AS seat_price,
//         MAX(m.movie_id) AS movie_id,
//         MAX(m.title) AS movie_title,
//         MAX(m.poster_image) AS poster_image,
//         MAX(scr.screen_id) AS screen_id,
//         MAX(scr.screen_name) AS screen_name,
//         MAX(cin.cinema_id) AS cinema_id,
//         MAX(cin.name) AS cinema_name,
//         MAX(os.order_id) AS order_id,
//         MAX(os.payment_method) AS payment_method,
//         MAX(os.total_amount) AS total_amount,
//         MAX(os.discount) AS discount,
//         MAX(os.final_amount) AS final_amount,
//         GROUP_CONCAT(DISTINCT sl.seat_label ORDER BY sl.seat_label SEPARATOR ', ') AS seat_labels
//       FROM tbl_booking b
//       JOIN tbl_user u ON b.user_id = u.id
//       JOIN tbl_showtime st ON b.showtime_id = st.showtime_id
//       JOIN tbl_movie m ON st.movie_id = m.movie_id
//       JOIN tbl_screen scr ON st.screen_id = scr.screen_id
//       JOIN tbl_cinema cin ON scr.cinema_id = cin.cinema_id
//       LEFT JOIN tbl_order_summary os ON b.booking_id = os.booking_id
//       LEFT JOIN tbl_booking_seat bseat ON b.booking_id = bseat.booking_id
//       LEFT JOIN tbl_seat_layout sl ON bseat.seat_id = sl.seat_id
//       LEFT JOIN tbl_showtime_seat_type_price stp ON 
//         st.showtime_id = stp.showtime_id AND 
//         sl.seat_type = stp.seat_type
//       WHERE cin.owner_id = ?
//       GROUP BY b.booking_id
//       ORDER BY b.booking_id DESC
//     `, [owner_id]);

//     res.json(bookings);
//   } catch (err) {
//     console.error('Error fetching bookings by owner ID:', err);
//     res.status(500).json({ error: 'Failed to retrieve bookings: ' + err.message });
//   }
// };



exports.getBookingByCinemaIdAdmin = async (req, res) => {
  let connection;
  try {
    const { cinema_id } = req.body;

    if (!cinema_id) {
      return res.status(400).json({ message: 'Cinema ID is required' });
    }

    connection = await pool.getConnection();
    const [bookingsResult] = await connection.execute('CALL getBookingByCinemaIdAdmin(?)', [cinema_id]);
    res.json(bookingsResult[0]);
  } catch (err) {
    console.error('Error fetching bookings by cinema ID:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings: ' + err.message });
  } finally {
    if (connection) connection.release();
  }
};



exports.getBookingByOwnerIdAdmin = async (req, res) => {
  let connection;
  try {
    const { owner_id } = req.body;

    if (!owner_id) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }

    connection = await pool.getConnection();
    const [bookingsResult] = await connection.execute('CALL getBookingByOwnerIdAdmin(?)', [owner_id]);
    res.json(bookingsResult[0]);
  } catch (err) {
    console.error('Error fetching bookings by owner ID:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings: ' + err.message });
  } finally {
    if (connection) connection.release();
  }
};
