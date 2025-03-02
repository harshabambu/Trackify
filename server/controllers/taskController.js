const Task = require("../models/Task");

// ✅ Fetch tasks for a specific user
exports.getTasks = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    console.error("🚨 Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ Add a new task
exports.addTask = async (req, res) => {
  try {
    const { title, description, status, priority, deadline, userId } = req.body;

    if (!title || !userId || !deadline) {
      return res.status(400).json({ error: "Title, deadline, and userId are required" });
    }

    const newTask = new Task({ title, description, status, priority, deadline, userId });
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("🚨 Error adding task:", error);
    res.status(500).json({ error: "Failed to add task" });
  }
};

// ✅ Update Task Status with Completion Date
// ✅ Update Task Status with Completion Date
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updateFields = { status };

    // ✅ If task is marked as "Completed," store completion date
    if (status === "Completed") {
      updateFields.completedAt = new Date();
    } else {
      updateFields.completedAt = null; // Reset if status changes back
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    res.json(updatedTask);
  } catch (error) {
    console.error("🚨 Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("🚨 Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
