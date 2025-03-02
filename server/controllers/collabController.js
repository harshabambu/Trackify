const Collaboration = require("../models/Collaboration");
const Task = require("../models/Task");
const User = require("../models/User");

// Search Users
exports.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let users;
    if (search) {
      users = await User.find({
        username: { $regex: search, $options: "i" },
      }).select("username email _id");
    } else {
      users = await User.find({}).select("username email _id");
    }
    res.json(users);
  } catch (error) {
    console.error("🚨 Error searching users:", error);
    res.status(500).json({ error: "Error searching users" });
  }
};

// Send Request
exports.sendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (senderId === receiverId) {
      return res.status(400).json({ error: "You cannot send a request to yourself" });
    }
    const existingRequest = await Collaboration.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
      status: { $in: ["pending", "accepted"] },
    });
    if (existingRequest) {
      return res.status(400).json({ error: "Request already exists" });
    }
    const request = new Collaboration({ sender: senderId, receiver: receiverId });
    await request.save();
    res.status(201).json({ message: "Request sent successfully", request });
  } catch (error) {
    console.error("🚨 Error sending request:", error);
    res.status(500).json({ error: "Error sending request" });
  }
};

// Accept Request
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Collaboration.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request already processed" });
    }
    request.status = "accepted";
    await request.save();
    res.status(200).json({ message: "Request accepted successfully", request });
  } catch (error) {
    console.error("🚨 Error in acceptRequest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Collaboration Requests
exports.getRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await Collaboration.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: "pending",
    }).populate("sender", "username").populate("receiver", "username");
    res.json(requests);
  } catch (error) {
    console.error("🚨 Error in getRequests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign Task
exports.assignTask = async (req, res) => {
  try {
    const { assignerId, assigneeId, title, description, priority, deadline } = req.body;
    const collaboration = await Collaboration.findOne({
      $or: [
        { sender: assignerId, receiver: assigneeId },
        { sender: assigneeId, receiver: assignerId },
      ],
      status: "accepted",
    });
    if (!collaboration) {
      return res.status(403).json({ error: "You can only assign tasks to accepted collaborators" });
    }
    const task = new Task({
      title,
      description,
      status: "Pending",
      priority: priority || "Medium",
      deadline: deadline || null,
      userId: assigneeId,
      assignerId,
    });
    await task.save();
    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (error) {
    console.error("🚨 Error in assignTask:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Tasks
exports.getTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({
      $or: [{ userId }, { assignerId: userId }],
    })
      .populate("userId", "username")
      .populate("assignerId", "username");
    res.json(tasks);
  } catch (error) {
    console.error("🚨 Error in getTasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Complete Task
exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    task.status = "Completed";
    task.completedAt = new Date();
    await task.save();
    res.status(200).json({ message: "Task completed successfully", task });
  } catch (error) {
    console.error("🚨 Error in completeTask:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Task 
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    // Only allow deletion if task is completed (no auth check for now)
    if (task.status !== "Completed") {
      return res.status(403).json({ error: "Can only delete completed tasks" });
    }
    await Task.deleteOne({ _id: taskId });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("🚨 Error in deleteTask:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Get Friends (Your working version)
exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const friends = await Collaboration.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: "accepted",
    }).populate("sender", "username").populate("receiver", "username");
    res.json(friends);
  } catch (error) {
    console.error("🚨 Error in getFriends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};