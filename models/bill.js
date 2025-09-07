const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, // linked user
  patientName: { 
    type: String, 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  rawText: { 
    type: String, 
    required: true 
  },
  analysis: { 
    type: Object, 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Bill", billSchema);
