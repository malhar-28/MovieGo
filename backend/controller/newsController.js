const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Add News

exports.addNews = async (req, res) => {
    const dbConnection = await pool.getConnection(); // Use a connection for transaction
    try {
        await dbConnection.beginTransaction();

        const { title, description } = req.body;
        const create_user = req.user.email;
        let context = req.body.context || '[]';

        // Handle Thumbnail Image first to get a temporary name
        const thumbnail = req.files.find(f => f.fieldname === 'image');
        if (!thumbnail) {
            throw new Error('Featured Image is required.');
        }

        // Generate a unique name for the temporary file
        const tempImageName = `temp_News-${uuidv4()}${path.extname(thumbnail.originalname).toLowerCase()}`;
        const tempImagePath = path.join('NewsImage', tempImageName);
        fs.renameSync(thumbnail.path, tempImagePath); // Save with temporary name

        // 1. Initial Insert with the temporary image name
        const [insertResult] = await dbConnection.execute(
            'INSERT INTO tbl_news (title, description, image, create_user) VALUES (?, ?, ?, ?)',
            [title, description, tempImageName, create_user] // Include tempImageName here
        );
        const newsId = insertResult.insertId;

        // 2. Rename the thumbnail image to its final name using newsId
        const finalImageName = `News-${newsId}${path.extname(thumbnail.originalname).toLowerCase()}`;
        const finalImagePath = path.join('NewsImage', finalImageName);

        // Remove the old temp file if it exists before renaming
        if (fs.existsSync(tempImagePath)) {
            fs.renameSync(tempImagePath, finalImagePath);
        } else {
            // This case might happen if the file was already moved or some other edge case
            // If the thumbnail.path is still valid here, rename directly
            fs.renameSync(thumbnail.path, finalImagePath);
        }

        // 3. Process Context JSON and its images
        const contextJson = JSON.parse(context);
        const updatedContext = contextJson.map((block) => {
            if (block.imageField) {
                const file = req.files.find(f => f.fieldname === block.imageField);
                if (file) {
                    const blockImageName = `NewsBlock-${uuidv4()}${path.extname(file.originalname).toLowerCase()}`;
                    fs.renameSync(file.path, path.join('NewsImage', blockImageName));
                    block.image = blockImageName;
                }
            }
            if (block.leftImageField) {
                const file = req.files.find(f => f.fieldname === block.leftImageField);
                if (file) {
                    const blockImageName = `NewsBlock-${uuidv4()}-left${path.extname(file.originalname).toLowerCase()}`;
                    fs.renameSync(file.path, path.join('NewsImage', blockImageName));
                    block.leftImage = blockImageName;
                }
            }
            if (block.rightImageField) {
                const file = req.files.find(f => f.fieldname === block.rightImageField);
                if (file) {
                    const blockImageName = `NewsBlock-${uuidv4()}-right${path.extname(file.originalname).toLowerCase()}`;
                    fs.renameSync(file.path, path.join('NewsImage', blockImageName));
                    block.rightImage = blockImageName;
                }
            }
            return block;
        });

        // 4. Final Update with the correct image name and processed context
        await dbConnection.execute(
            'UPDATE tbl_news SET image = ?, context = ? WHERE news_id = ?',
            [finalImageName, JSON.stringify(updatedContext), newsId]
        );

        await dbConnection.commit(); // Commit the transaction
        res.json({ message: 'News added successfully' });

    } catch (err) {
        await dbConnection.rollback(); // Rollback on error
        console.error('Error in addNews:', err);
        // Clean up uploaded files if something went wrong, including temp files
        req.files.forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (unlinkErr) {
                console.warn('Could not delete temporary file:', file.path, unlinkErr.message);
            }
        });
        res.status(500).json({ error: err.message || 'Internal Server Error' });
    } finally {
        dbConnection.release(); // Always release the connection
    }
};
// Get All News
exports.getAllNews = async (req, res) => {
  try {
    const [rows] = await pool.execute('CALL GetAllNews()');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get News by ID
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'News ID is required' });

    const [rows] = await pool.execute('CALL GetNewsById(?)', [id]);
    res.json(rows[0][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update News
exports.updateNews = async (req, res) => {
  try {
    const { id, title, description, context } = req.body;
    if (!id) return res.status(400).json({ message: 'News ID is required' });

    const update_user = req.user.email;

    let newImageName = null;
    const thumbnail = req.files.find(f => f.fieldname === 'image');

    if (thumbnail) {
      const ext = path.extname(thumbnail.originalname).toLowerCase();
      newImageName = `News-${id}${ext}`;

      // Delete old image if exists
      const [[oldData]] = await pool.query('SELECT image FROM tbl_news WHERE news_id = ?', [id]);
      if (oldData?.image) {
        const oldImagePath = path.join('NewsImage', oldData.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      fs.renameSync(thumbnail.path, path.join('NewsImage', newImageName));
    }

    let updatedContext = null;

    if (context) {
      const parsedContext = JSON.parse(context);
      const enrichedContext = parsedContext.map((block) => {
        if (block.imageField) {
          const file = req.files.find(f => f.fieldname === block.imageField);
          if (file) block.image = file.filename;
        }
        if (block.leftImageField) {
          const file = req.files.find(f => f.fieldname === block.leftImageField);
          if (file) block.leftImage = file.filename;
        }
        if (block.rightImageField) {
          const file = req.files.find(f => f.fieldname === block.rightImageField);
          if (file) block.rightImage = file.filename;
        }
        return block;
      });
      updatedContext = JSON.stringify(enrichedContext);
    }

    await pool.execute('CALL UpdateNewsProcedure(?, ?, ?, ?, ?, ?)', [
      id,
      title || null,
      description || null,
      newImageName || null,
      updatedContext || null,
      update_user,
    ]);

    res.json({ message: 'News updated successfully' });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete News
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'News ID is required' });

    const [[oldData]] = await pool.query('SELECT image FROM tbl_news WHERE news_id = ?', [id]);
    if (oldData?.image) {
      const oldImagePath = path.join('NewsImage', oldData.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await pool.execute('CALL DeleteNews(?)', [id]);
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle News Status
exports.toggleNewsStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'News ID is required' });

    await pool.execute('CALL ToggleNewsStatus(?)', [id]);
    res.json({ message: 'Status toggled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};