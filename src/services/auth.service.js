const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError, ValidationError } = require('../utils/errors');

class AuthService {
  async register(userData) {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }

    // Create user
    const user = await User.create({
      username: userData.username, // Changed from name to username
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName // Added fullName field
    });

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username, // Changed from name to username
        email: user.email,
        fullName: user.fullName // Added fullName
      },
      token
    };
  }

  async login(credentials) {
    // Check if user exists
    const user = await User.findOne({ where: { email: credentials.email } });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(credentials.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');  // Changed from ValidationError to UnauthorizedError
    }

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,  // Changed from user.name to user.username
        email: user.email,
        fullName: user.fullName  // Added fullName to match the model
      },
      token
    };
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
  }
}

module.exports = new AuthService();