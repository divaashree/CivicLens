const Complaint = require("../models/Complaint");
const classifyIssue = require("../services/aiService");

// Create Complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, image, location } = req.body;

    // AI classification
    const { category, severity } = classifyIssue(description);

    const complaint = await Complaint.create({
      title,
      description,
      image,
      location,
      category,
      severity,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Complaints
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};