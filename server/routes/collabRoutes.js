const express = require("express");
const {
  searchUsers,
  sendRequest,
  acceptRequest,
  getRequests,
  assignTask,
  getTasks,
  completeTask,
  deleteTask,
  getFriends,
} = require("../controllers/collabController");

const router = express.Router();

router.get("/users", searchUsers);
router.post("/request", sendRequest);
router.put("/accept/:requestId", acceptRequest);
router.get("/requests/:userId", getRequests); // Line 24 (based on typical line numbering)
router.post("/tasks", assignTask);
router.get("/tasks/:userId", getTasks);
router.put("/tasks/:taskId/complete", completeTask);
router.delete("/tasks/:taskId", deleteTask);
router.get("/friends/:userId", getFriends);


module.exports = router;