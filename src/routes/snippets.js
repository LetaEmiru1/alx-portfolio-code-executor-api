const express = require('express');
const router = express.Router();
const {
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet
} = require('../controllers/snippetController');

// Import the 'protect' middleware.
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file.
// Any request to a route defined below this line must have a valid token.
router.use(protect);

// Define the routes using a chained syntax for cleaner code.
router.route('/')
  .get(getSnippets)
  .post(createSnippet);

router.route('/:id')
  .get(getSnippetById)
  .put(updateSnippet)
  .delete(deleteSnippet);

module.exports = router;
