const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This is our 'protect' middleware function.
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request headers contain an 'authorization' header, and if it starts with 'Bearer'.
  // This is the standard way of sending a JWT.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header (e.g., "Bearer <token>" -> "<token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our JWT_SECRET.
      // This function decodes the token. If it's not valid (e.g., tampered with or expired), it will throw an error.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user from the ID that was in the token's payload.
      // We attach the user object to the request ('req.user'), but we exclude the password for security.
      // This 'req.user' will be available in any subsequent route that uses this middleware.
      req.user = await User.findById(decoded.user.id).select('-password');

      // 5. If everything is successful, call 'next()' to pass control to the next middleware or the actual route handler.
      next();

    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If there's no token at all in the header.
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
