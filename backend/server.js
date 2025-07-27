// server.js
require('dotenv').config(); // Loads .env file contents
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth'); // Import our new auth routes
const analysisRoutes = require('./routes/analysis'); // <-- ADD THIS LINE
const User = require('./models/User'); // Import the User model

const app = express();
const PORT = process.env.PORT || 5001;

const passport = require('passport'); // <-- Import passport
require('./config/passport-setup'); // <-- This runs our new passport config file

// --- Middleware ---
// This line allows our server to accept and parse JSON in the body of requests
app.use(express.json());

// ... app setup
app.use(express.json());
app.use(passport.initialize());

// --- Routes ---
// Tell our app to use the auth routes for any URL starting with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

// --- Start Server and Sync Database ---
async function startServer() {
  try {
    // This connects to the database AND creates tables if they don't exist
    // {force: false} prevents it from dropping tables every time. Use {force: true} to reset.
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to sync database or start server:', error);
  }
}

startServer();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Application specific logging, throwing an error, or other logic here
  process.exit(1); // It's often recommended to restart the process on uncaught exceptions
});