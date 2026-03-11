const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // Create user
    const user = await User.create({
      username,
      password,
      role
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate email & password
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Please provide a username and password' });
    }

    // Check for user
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};


exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id, role: user.role }, 'supersecretrecipekey', {
    expiresIn: '30d'
  });

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};
