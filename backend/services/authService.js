const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
  // Generate JWT Token
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  // Register User
  async registerUser(name, email, password) {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error('Invalid user data');
    }
  }

  // Login User
  async loginUser(email, password) {
    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new Error('Invalid email or password');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: this.generateToken(user._id),
    };
  }

  // Get user profile
  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new AuthService();