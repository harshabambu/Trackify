const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: "Pending" },
  priority: { type: String, default: "Medium" },
  deadline: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assignee
  assignerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Add assigner
  completedAt: { type: Date, default: null },
});

module.exports = mongoose.model("Task", TaskSchema);