const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user.model'); // ✅ Make sure to import your User model

exports.authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    // ✅ Fetch the latest user from DB to get fresh isVerified and other flags
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
