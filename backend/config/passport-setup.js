// config/passport-setup.js
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy({
    // Options for the Google strategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    // This function is called when a user successfully logs in with Google
    try {
      // Check if user already exists in our database
      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (user) {
        // If they exist, we're done
        done(null, user);
      } else {
        // If they don't exist, create a new user in our database
        // We create a "dummy" password because our model requires one.
        // The user will never use this password as they'll always log in via Google.
        user = await User.create({
          email: profile.emails[0].value,
          password: `google_oauth_${Date.now()}` // Dummy password
        });
        done(null, user);
      }
    } catch (error) {
      done(error, null);
    }
  })
);