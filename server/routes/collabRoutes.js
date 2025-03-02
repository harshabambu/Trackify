const express = require("express");
const {
  searchUsers,
  sendRequest,
  acceptRequest,
  getRequests,
  assignTask,
  getTasks,
} = require("../controllers/collabController"); // Corrected controller name

const router = express.Router();

router.get("/users", searchUsers);
router.post("/request", sendRequest);
router.put("/accept/:requestId", acceptRequest);
router.get("/requests/:userId", getRequests);
router.post("/tasks", assignTask);
router.get("/tasks/:userId", getTasks);

module.exports = router;