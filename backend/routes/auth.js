// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport'); // Make sure passport is imported
const User = require('../models/User');

const router = express.Router();

// --- REGISTRATION ENDPOINT ---
// Handles POST requests to /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const newUser = await User.create({ email, password });
    res.status(201).json({ message: 'User created successfully!', userId: newUser.id });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- LOGIN ENDPOINT ---
// Handles POST requests to /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate a JWT using the secret from the .env file
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // <-- CORRECTED
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Login successful!', token });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- GOOGLE OAUTH ROUTES ---

// Route 1: The initial login route.
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Route 2: The callback route.
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // User is now authenticated by passport. We have req.user.
  // We will now manually create a JWT for them.
  const token = jwt.sign(
    { id: req.user.id, email: req.user.email },
    process.env.JWT_SECRET, // <-- CORRECTED
    { expiresIn: '24h' }
  );

  // Redirect the user back to the frontend dashboard, with the token in the URL
  res.redirect(`http://localhost/dashboard?token=${token}`);
});

module.exports = router;