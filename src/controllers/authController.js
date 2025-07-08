// Import the User model so we can interact with the users collection.
const User = require('../models/User');
// Import bcrypt for password hashing.
const bcrypt = require('bcryptjs');
// Import jsonwebtoken for creating JWTs.
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  // 1. Get user data from the request body
  const { username, email, password } = req.body;

  try {
    // 2. Check if a user with this email or username already exists
    let user = await User.findOne({ email });
    if (user) {
      // If the user exists, send a 400 Bad Request error.
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. If user does not exist, create a new user instance
    user = new User({
      username,
      email,
      password
    });

    // 4. Hash the password before saving
    // 'salt' is random data mixed with the password to make it more secure.
    const salt = await bcrypt.genSalt(10);
    // Overwrite the plain text password with the hashed one.
    user.password = await bcrypt.hash(password, salt);

    // 5. Save the new user to the database
    await user.save();

    // 6. Send a success response
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate a user and get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  // 1. Get user data from the request body
  const { email, password } = req.body;

  try {
    // 2. Check if a user with this email exists
    let user = await User.findOne({ email });
    if (!user) {
      // If no user is found, it's an invalid credentials error.
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords don't match, it's also an invalid credentials error.
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. If credentials are correct, create a JWT
    // The 'payload' is the data we want to store in the token.
    const payload = {
      user: {
        id: user.id // We only need the user's unique ID in the payload.
      }
    };

    // 'sign' the token with our secret key. This key must be protected!
    // We'll add JWT_SECRET to our .env file next.
    // 'expiresIn' makes the token automatically expire after a set time (e.g., 1 hour).
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // 5. Send the token back to the user
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


// Export the functions to be used in our routes file.
module.exports = {
  registerUser,
  loginUser
};
