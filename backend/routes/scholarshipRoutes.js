const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Scholarship = require('../models/Scholarship');

const { applyForScholarship, addScholarship, uploadScholarshipsCSV } = require('../controllers/scholarshipController');

// GET /api/scholarships
router.get('/', async (req, res) => {
  try {
    const scholarships = await Scholarship.find({});
    res.json(scholarships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add-scholarship', addScholarship);
router.post('/apply', applyForScholarship);
router.post('/upload', upload.single('file'), uploadScholarshipsCSV);

module.exports = router;
