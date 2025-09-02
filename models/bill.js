const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  hospital: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      cost: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  analyzedReport: {
    overcharged: [
      {
        item: String,
        charged: Number,
        avg: Number,
        diff: Number
      }
    ],
    fair: [
      {
        item: String,
        charged: Number,
        avg: Number
      }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);
