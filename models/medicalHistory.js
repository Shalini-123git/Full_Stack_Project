const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  pregnancyStartDate: { 
    type: Date, 
    required: true 
  },
  dueDate: { type: Date },

  // Blood type
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true
  },

  // Pregnancy-specific health info
  gravida: { type: Number, default: 1 }, // total pregnancies
  para: { type: Number, default: 0 }, // births after 20 weeks
  previousPregnancyComplications: { type: String }, // notes if any

  // Existing medical conditions
  medicalConditions: [
    {
      type: String,
      enum: [
        "Diabetes",
        "Hypertension",
        "Thyroid",
        "Asthma",
        "Heart Disease",
        "None"
      ]
    }
  ],

  // Allergies
  allergies: { type: String, default: "None" },

  // Current medications
  medications: { type: String, default: "None" },

  // Vaccination info
  vaccinations: {
    tetanus: { type: Boolean, default: false },
    flu: { type: Boolean, default: false },
    covid: { type: Boolean, default: false }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);
