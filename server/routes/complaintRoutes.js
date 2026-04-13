const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getComplaints,
} = require("../controllers/complaintController");

// POST - create complaint
router.post("/", createComplaint);

// GET - all complaints
router.get("/", getComplaints);

module.exports = router;