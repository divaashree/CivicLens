const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");



// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 CivicLens API Running");
});

// Routes
app.use("/api/complaints", require("./routes/complaintRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);