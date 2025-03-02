const express = require("express");
const router = express.Router();
const { getTasks, addTask, updateTask, deleteTask } = require("../controllers/taskController");

// ✅ Fetch tasks for a specific user
router.get("/", getTasks);

// ✅ Add new task
router.post("/", addTask);

// ✅ Update task
router.put("/:id", updateTask);

// ✅ Delete task
router.delete("/:id", deleteTask);

module.exports = router;
