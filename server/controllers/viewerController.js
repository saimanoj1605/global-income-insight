const Viewer = require('../models/Viewer');

exports.createViewer = async (req, res) => {
  try {
    const { name, city, state, country, feedback, liked } = req.body;
    const viewer = new Viewer({ name, city, state, country, feedback, liked });
    await viewer.save();
    res.status(201).json(viewer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTotalLikes = async (req, res) => {
  try {
    const count = await Viewer.countDocuments({ liked: true });
    res.json({ totalLikes: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};