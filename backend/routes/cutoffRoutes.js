const express = require('express');
const router = express.Router();
const { getCutoffs, createCutoff, updateCutoff, deleteCutoff } = require('../controllers/cutoffController');

router.get('/', getCutoffs);
router.post('/', createCutoff);
router.put('/:id', updateCutoff);
router.delete('/:id', deleteCutoff);

module.exports = router;
