const mongoose = require("mongoose");

const hospitalCostSchema = new mongoose.Schema({
  item: { type: String, required: true },
  avgCost: { type: Number, required: true },
  region: { type: String, required: true },
  source: { type: String } // e.g., Gov/NGO/Survey
});

module.exports = mongoose.model("HospitalCost", hospitalCostSchema);
