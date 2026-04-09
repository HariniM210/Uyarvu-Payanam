const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Scholarship = require('../models/Scholarship');

const { 
  applyForScholarship, 
  addScholarship, 
  uploadScholarshipsCSV, 
  updateScholarship, 
  deleteScholarship 
} = require('../controllers/scholarshipController');
const verifyAdmin = require('../middleware/verifyAdmin');

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

router.post('/add-scholarship', verifyAdmin, addScholarship);
router.post('/apply', applyForScholarship);
router.post('/upload', verifyAdmin, upload.single('file'), uploadScholarshipsCSV);
router.put('/:id', verifyAdmin, updateScholarship);
router.delete('/:id', verifyAdmin, deleteScholarship);

module.exports = router;
