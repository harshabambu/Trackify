const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: "Pending" },
  priority: { type: String, default: "Medium" },
  deadline: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completedAt: { type: Date, default: null }, // ✅ Added: Track when a task is completed
});

module.exports = mongoose.model("Task", TaskSchema);
