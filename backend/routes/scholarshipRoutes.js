const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');

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

module.exports = router;
