const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorised. Please log in.' });

    const token = auth.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError')
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user)
      return res.status(401).json({ message: 'Account not found. Please register again.' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};

module.exports = { protect };