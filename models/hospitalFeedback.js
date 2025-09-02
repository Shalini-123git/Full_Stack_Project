const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
