const User = require('../models/User');
const Viewer = require('../models/Viewer');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getViewers = async (req, res) => {
  try {
    const viewers = await Viewer.find();
    res.json(viewers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalViewers = await Viewer.countDocuments();
    res.json({ totalUsers, totalViewers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};