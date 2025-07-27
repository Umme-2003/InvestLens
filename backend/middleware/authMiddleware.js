// backend/middleware/authMiddleware.js
require('dotenv').config(); // Make sure environment variables are available
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from the Authorization header
  const authHeader = req.header('Authorization');

  // Check if no token is provided
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    // The header format is typically "Bearer TOKEN". We need to extract just the token part.
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token format is invalid, authorization denied.' });
    }
    
    // Verify the token using the secret from your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user payload from the token to the request object
    // Now, any subsequent route handler can access req.user
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next(); 
  } catch (error) {
    // This will catch errors like an expired token or an invalid signature
    res.status(401).json({ message: 'Token is not valid.' });
  }
};