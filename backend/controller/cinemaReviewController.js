const pool = require('../config/db');

// Add Review
exports.addReview = async (req, res) => {
  const { cinema_id, user_id, rating, comment, create_user, update_user } = req.body;

   console.log('Add Review payload:', req.body); // 🐛 Debug

  // 🛡️ Validation
  if (!cinema_id || !user_id || rating == null || !create_user || !update_user) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    await pool.query('CALL AddCinemaReview(?, ?, ?, ?, ?, ?)', [
      cinema_id, user_id, rating, comment, create_user, update_user,
    ]);
    await pool.query('CALL UpdateCinemaRatings(?)', [cinema_id]);
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  const { review_id, rating, comment, update_user } = req.body;

  if (!review_id) return res.status(400).json({ message: 'Review ID is required' });

  try {
    const [[review]] = await pool.query('SELECT cinema_id FROM tbl_cinema_review WHERE review_id = ?', [review_id]);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await pool.query('CALL UpdateCinemaReview(?, ?, ?, ?)', [
      review_id, rating, comment, update_user,
    ]);
    await pool.query('CALL UpdateCinemaRatings(?)', [review.cinema_id]);

    res.json({ message: 'Review updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  const { review_id } = req.body;

  if (!review_id) return res.status(400).json({ message: 'Review ID is required' });

  try {
    const [[review]] = await pool.query('SELECT cinema_id FROM tbl_cinema_review WHERE review_id = ?', [review_id]);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await pool.query('CALL DeleteCinemaReview(?)', [review_id]);
    await pool.query('CALL UpdateCinemaRatings(?)', [review.cinema_id]);

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle Review Status (Active <-> Inactive)
exports.toggleReviewStatus = async (req, res) => {
  const { review_id } = req.body;

  if (!review_id) return res.status(400).json({ message: 'Review ID is required' });

  try {
    const [[review]] = await pool.query('SELECT cinema_id FROM tbl_cinema_review WHERE review_id = ?', [review_id]);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await pool.query('CALL ToggleCinemaReviewStatus(?)', [review_id]);
    await pool.query('CALL UpdateCinemaRatings(?)', [review.cinema_id]);

    res.json({ message: 'Review status toggled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Reviews for a Specific Cinema (User Side)
exports.getCinemaReviews = (req, res) => {
  const { cinema_id } = req.body;

  if (!cinema_id) return res.status(400).json({ message: 'Cinema ID is required' });

  pool.query('CALL GetCinemaReviews(?)', [cinema_id])
    .then(([rows]) => res.json(rows[0]))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Get All Reviews
exports.getAllReviews = (req, res) => {
  pool.query('CALL GetAllCinemaReviews()')
    .then(([rows]) => res.json(rows[0]))
    .catch((err) => res.status(500).json({ error: err.message }));
};




exports.getReviewsByOwnerId = async (req, res) => {
  try {
    const { owner_id } = req.body;

    if (!owner_id) {
      return res.status(400).json({ message: 'Owner ID is required.' });
    }

    const [rows] = await pool.query('CALL GetCinemaReviewsByOwnerId(?)', [owner_id]);

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching reviews by owner ID:', err);
    res.status(500).json({ error: 'Failed to retrieve reviews: ' + err.message });
  }
};
