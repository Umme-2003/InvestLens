// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  // Define the columns in the 'Users' table
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // This field cannot be empty
    unique: true,     // Each email must be unique in the table
    validate: {
      isEmail: true,  // Ensures the value is a valid email format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// This is a "hook" that runs automatically before a new user is created.
// It takes the user's plain text password and hashes it.
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10); // Generate a "salt" for security
  user.password = await bcrypt.hash(user.password, salt); // Hash the password
});

module.exports = User;