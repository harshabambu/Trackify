const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// ✅ API to fetch tasks due in 1 day
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // ✅ Get today's date & tomorrow's date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // 1 day ahead

    // ✅ Find tasks that are due tomorrow
    const tasksDueSoon = await Task.find({
      userId: userId,
      deadline: { $gte: today, $lte: tomorrow },
    });

    res.json(tasksDueSoon);
  } catch (error) {
    console.error("🚨 Error fetching notifications:", error);
    res.status(500).json({ error: "Server error fetching notifications" });
  }
});

module.exports = router;
