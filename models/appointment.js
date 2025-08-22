const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    mother: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // mother or patient
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // doctor assigned
        required: true
    },
    caregiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // optional caregiver
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending"
    },
    notes: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // who booked it (mother/caregiver)
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
