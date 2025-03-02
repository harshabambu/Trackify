const express = require("express");
const {
  searchUsers,
  sendRequest,
  acceptRequest,  // Ensure this function exists
  getFriends,
  assignTask,
} = require("../controllers/collabController");

const router = express.Router();

router.get("/search", searchUsers);
router.post("/request", sendRequest);
router.put("/accept/:requestId", acceptRequest);  // Ensure this is defined
router.get("/friends/:userId", getFriends);
router.post("/assign-task", assignTask);

module.exports = router;
