const express = require('express');
const router = express.Router();

// Import our protect middleware.
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/test/protected
// @desc    An example protected route
// @access  Private
// To make a route protected, we add our 'protect' middleware as the second argument.
// Express will run 'protect' first. If it calls next(), then the final function will run.
router.get('/protected', protect, (req, res) => {
  // Because the 'protect' middleware ran successfully, we now have access to req.user.
  res.json({
    message: 'You have accessed the protected route!',
    user: req.user
  });
});

module.exports = router;
