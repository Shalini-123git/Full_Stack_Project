const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["mother", "caregiver", "doctor", "baby"],
        default: "mother"
    },
    emergencyContacts: [
        {
            name: String,
            relation: String,
            phone: String
        }
    ],
    hospitalContact: {
        name: String,
        phone: String,
        address: String
    },
    community: {
        state: String,
        district: String,
        groupLink: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = new mongoose.model("User", userSchema);
