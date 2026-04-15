const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getComplaints,
  updateComplaint,
  upvoteComplaint,
  addComment,
} = require("../controllers/complaintController");

// POST - create complaint
router.post("/", createComplaint);

// GET - all complaints
router.get("/", getComplaints);

// PUT - update complaint status and department
router.put("/:id", updateComplaint);

// PATCH - upvote complaint
router.patch("/:id/upvote", upvoteComplaint);

// POST - add comment to complaint
router.post("/:id/comment", addComment);

module.exports = router;