const express = require('express');
const router = express.Router();
const { executeCode } = require('../controllers/executionController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/execute
// @desc    Execute code snippet
// @access  Private
router.post('/', protect, executeCode);

module.exports = router;
