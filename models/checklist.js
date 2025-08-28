const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
    unique: true
  },
  tasks: {
    type: [String], // array of strings
    required: true
  }
});

module.exports = mongoose.model("Checklist", checklistSchema);
