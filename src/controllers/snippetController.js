const Snippet = require('../models/Snippet');
const User = require('../models/User');

// @desc    Get all snippets for the logged-in user
// @route   GET /api/snippets
// @access  Private
const getSnippets = async (req, res) => {
  try {
    // Find all snippets where the 'user' field matches the logged-in user's ID.
    // req.user.id is available thanks to our 'protect' middleware.
    const snippets = await Snippet.find({ user: req.user.id });
    res.json(snippets);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single snippet by its ID
// @route   GET /api/snippets/:id
// @access  Private
const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Authorization Check: Make sure the logged-in user owns this snippet.
    if (snippet.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.json(snippet);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new snippet
// @route   POST /api/snippets
// @access  Private
const createSnippet = async (req, res) => {
  const { title, language, code } = req.body;

  try {
    const newSnippet = new Snippet({
      title,
      language,
      code,
      user: req.user.id // Assign ownership to the logged-in user.
    });

    const snippet = await newSnippet.save();
    res.status(201).json(snippet);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
// @access  Private
const updateSnippet = async (req, res) => {
  try {
    let snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Authorization Check
    if (snippet.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    snippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // This option returns the document after the update is applied.
      runValidators: true // This ensures any updates still follow the schema rules.
    });

    res.json(snippet);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
// @access  Private
const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Authorization Check
    if (snippet.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Snippet.findByIdAndDelete(req.params.id);

    res.json({ message: 'Snippet removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet
};
