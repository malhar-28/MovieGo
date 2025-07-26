const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const MOVIE_IMAGE_DIR = 'MovieImages/';

// Helper: Delete image file
const deleteImageFile = (filename) => {
    if (!filename) return;
    const filePath = path.join(process.cwd(), MOVIE_IMAGE_DIR, path.basename(filename));
    fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error(`Error deleting file ${filePath}:`, err);
        }
    });
};

// Add New Movie
exports.addMovie = async (req, res) => {
    const currentUser = req.user?.email || 'admin_system';
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Determine if this is a bulk add by checking files or body
        const isBulkAdd = req.files.length > 2; // More than 2 files (1 poster + 1 background)
        const bulkCount = isBulkAdd ?
            Math.ceil(req.files.length / 2) : // Calculate based on file count
            1;

        // Process each movie
        for (let i = 0; i < bulkCount; i++) {
            const index = isBulkAdd ? `_${i}` : '';

            // Get form data
            const formData = {
                title: req.body[`title${index}`],
                genre: req.body[`genre${index}`],
                duration: req.body[`duration${index}`],
                rating: req.body[`rating${index}`],
                synopsis: req.body[`synopsis${index}`],
                release_date: req.body[`release_date${index}`],
                release_status: req.body[`release_status${index}`],
                poster_image: null,
                background_image: null
            };

            // Validate required fields
            if (!formData.title || !formData.genre || !formData.duration ||
                !formData.rating || !formData.synopsis || !formData.release_date ||
                !formData.release_status) {
                throw new Error(`Movie ${i + 1}: All fields are required`);
            }

            // Find matching files
            const posterFile = req.files.find(f =>
                f.fieldname === `poster_image${index}` ||
                (i === 0 && f.fieldname === 'poster_image')
            );

            const backgroundFile = req.files.find(f =>
                f.fieldname === `background_image${index}` ||
                (i === 0 && f.fieldname === 'background_image')
            );

            // Only require poster for first movie in bulk or single add
            if (i === 0 && !posterFile) {
                throw new Error('Poster image is required for the first movie');
            }

            await connection.execute(
                'CALL AddMovie(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    formData.title,
                    formData.genre,
                    formData.duration,
                    formData.rating,
                    formData.synopsis,
                    posterFile?.filename || null,
                    backgroundFile?.filename || null,
                    formData.release_date,
                    formData.release_status,
                    currentUser
                ]
            );
        }

        await connection.commit();
        res.status(201).json({
            message: isBulkAdd
                ? `${bulkCount} movies added successfully`
                : 'Movie added successfully'
        });
    } catch (err) {
        await connection.rollback();

        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach(file => {
                if (file?.filename) {
                    deleteImageFile(file.filename);
                }
            });
        }

        console.error('Error adding movie(s):', err);
        res.status(500).json({
            error: 'Failed to add movie(s): ' + err.message
        });
    } finally {
        connection.release();
    }
};

// Update Movie
exports.updateMovie = async (req, res) => {
    let new_poster_filename = null;
    let new_background_filename = null;

    try {
        const {
            id,
            title,
            genre,
            duration,
            rating,
            synopsis,
            release_date,
            release_status,
            status,
            poster_image,
            background_image,
        } = req.body;

        const movieId = parseInt(id);
        if (isNaN(movieId)) {
            return res.status(400).json({ success: false, message: 'Invalid movie ID' });
        }

        const currentUser = req.user?.email || 'admin_system';

        // Step 1: Verify that the movie exists
        let currentMovie;
        try {
            const [rows] = await pool.execute('CALL GetMovieByIdAdmin(?)', [movieId]);
            if (!rows[0] || !rows[0][0]) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }
            currentMovie = rows[0][0];
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error verifying movie existence',
                error: err.message
            });
        }

        // Step 2: Handle file uploads
        const posterFile = req.files?.['poster_image']?.[0];
        const backgroundFile = req.files?.['background_image']?.[0];

        let poster_image_value = null;
        let background_image_value = null;

        // Poster logic
        if (posterFile) {
            new_poster_filename = posterFile.filename;
            if (currentMovie.poster_image) {
                deleteImageFile(currentMovie.poster_image);
            }
            poster_image_value = new_poster_filename;
        } else if (poster_image === '') {
            if (currentMovie.poster_image) {
                deleteImageFile(currentMovie.poster_image);
            }
            poster_image_value = '';
        }

        // Background logic
        if (backgroundFile) {
            new_background_filename = backgroundFile.filename;
            if (currentMovie.background_image) {
                deleteImageFile(currentMovie.background_image);
            }
            background_image_value = new_background_filename;
        } else if (background_image === '') {
            if (currentMovie.background_image) {
                deleteImageFile(currentMovie.background_image);
            }
            background_image_value = '';
        }

        // Step 3: Prepare parameters
        const releaseDate = release_date ? new Date(release_date) : null;

        const params = [
            movieId,
            title || null,
            genre || null,
            duration || null,
            rating || null,
            synopsis || null,
            poster_image_value,        // null (keep), '' (clear), or new filename
            background_image_value,    // same
            releaseDate,
            release_status || null,
            currentUser
        ];

        // Step 4: Execute with transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            await connection.execute(
                'CALL UpdateMovie(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                params
            );

            // Optional status update
            if (status && ['Active', 'Inactive'].includes(status)) {
                await connection.execute(
                    'UPDATE tbl_movie SET status = ?, update_user = ?, updated_at = CURRENT_TIMESTAMP WHERE movie_id = ?',
                    [status, currentUser, movieId]
                );
            }

            await connection.commit();
            connection.release();

            return res.json({
                success: true,
                message: 'Movie updated successfully',
                data: {
                    movie_id: movieId,
                    updated_fields: {
                        title: !!title,
                        genre: !!genre,
                        duration: !!duration,
                        rating: !!rating,
                        synopsis: !!synopsis,
                        release_date: !!release_date,
                        release_status: !!release_status,
                        status: status || null,
                        images_updated: {
                            poster: poster_image_value !== null,
                            background: background_image_value !== null
                        }
                    }
                }
            });

        } catch (err) {
            await connection.rollback();
            connection.release();
            throw err;
        }

    } catch (err) {
        if (new_poster_filename) deleteImageFile(new_poster_filename);
        if (new_background_filename) deleteImageFile(new_background_filename);

        console.error('Error updating movie:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to update movie',
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                sql: err.sql
            })
        });
    }
};

// Delete Movie
exports.deleteMovie = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Movie ID is required' });

        const [rows] = await connection.execute('CALL GetMovieByIdAdmin(?)', [id]);
        const movie = rows[0][0];
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        await connection.beginTransaction();
        await connection.execute('CALL DeleteMovie(?)', [id]);
        await connection.commit();

        if (movie.poster_image) deleteImageFile(movie.poster_image);
        if (movie.background_image) deleteImageFile(movie.background_image);

        res.json({ message: 'Movie deleted successfully' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error deleting movie:', err);
        res.status(500).json({ error: 'Failed to delete movie: ' + err.message });
    } finally {
        if (connection) connection.release();
    }
};

// Toggle Movie Status
exports.toggleMovieStatus = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Movie ID is required' });

        await pool.execute('CALL ToggleMovieStatus(?)', [id]);
        res.json({ message: 'Movie status toggled successfully' });
    } catch (err) {
        console.error('Error toggling movie status:', err);
        res.status(500).json({ error: 'Failed to toggle movie status: ' + err.message });
    }
};

// Admin: Get Movie By ID
exports.getMovieByIdAdmin = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Movie ID is required' });

        const [rows] = await pool.execute('CALL GetMovieByIdAdmin(?)', [id]);
        const movie = rows[0][0];
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        res.json(movie);
    } catch (err) {
        console.error('Error getting movie by ID:', err);
        res.status(500).json({ error: 'Failed to retrieve movie: ' + err.message });
    }
};

// Public: Get Active Movie By ID
exports.getMovieById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Movie ID is required' });

        const [rows] = await pool.execute('CALL GetActiveMovieById(?)', [id]);
        const movie = rows[0][0];
        if (!movie) return res.status(404).json({ message: 'Movie not found or not active' });

        res.json(movie);
    } catch (err) {
        console.error('Error getting public movie by ID:', err);
        res.status(500).json({ error: 'Failed to retrieve movie: ' + err.message });
    }
};

// Get All Movies (Admin)
exports.getAllMovies = async (req, res) => {
    try {
        const [rows] = await pool.execute('CALL GetAllMovies()');
        res.json(rows[0]);
    } catch (err) {
        console.error('Error getting all movies:', err);
        res.status(500).json({ error: 'Failed to retrieve all movies: ' + err.message });
    }
};

// Get Now Playing Movies
exports.getNowPlayingMovies = async (req, res) => {
    try {
        const [rows] = await pool.execute('CALL GetActiveNowPlayingMovies()');
        res.json(rows[0]);
    } catch (err) {
        console.error('Error getting now playing movies:', err);
        res.status(500).json({ error: 'Failed to retrieve now playing movies: ' + err.message });
    }
};

// Get Upcoming Movies
exports.getUpcomingMovies = async (req, res) => {
    try {
        const [rows] = await pool.execute('CALL GetActiveUpcomingMovies()');
        res.json(rows[0]);
    } catch (err) {
        console.error('Error getting upcoming movies:', err);
        res.status(500).json({ error: 'Failed to retrieve upcoming movies: ' + err.message });
    }
};
