const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController"); // Adjust path as needed

// POST route to handle feedback submission
router.post("/", feedbackController.createFeedback);
router.get("/", feedbackController.getFeedback);

module.exports = router;
