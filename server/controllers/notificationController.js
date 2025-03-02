const Task = require('../models/Task');

exports.getNotifications = async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const tasks = await Task.find({ userId: req.params.userId, deadline: { $lte: tomorrow } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};
