const mongoose = require("mongoose");

const babyActivitySchema = new mongoose.Schema({
    baby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // or "Baby" model
        required: true
    },
    caregiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // who logged
        required: true
    },
    activityType: {
        type: String,
        enum: ["feed", "sleep", "diaper", "cry"],
        required: true
    },

    // For Feeding
    feedType: { 
        type: String, 
        enum: ["breastmilk", "formula", "solid"], 
        default: null 
    },
    amount: { 
        type: Number,           //ml or gm
        default: null 
    },
    side: { 
        type: String, 
        enum: ["left", "right", "both", "none"], 
        default: "none" 
    },

    // For Sleep
    startTime: { 
        type: Date, 
        default: null 
    },
    endTime: { 
        type: Date, 
        default: null 
    },
    duration: { 
        type: Number, 
        default: null 
    }, // minutes
    sleepQuality: { 
        type: String, 
        enum: ["good", "fair", "poor"], 
        default: null 
    },

    // For Diaper
    diaperType: { 
        type: String, 
        enum: ["wet", "dirty", "mixed"], 
        default: null 
    },

    // For Crying
    cryDuration: { 
        type: Number,       // in minutes
        default: null 
    }, 
    cryReason: { 
        type: String, 
        trim: true, 
        default: null 
    },

    notes: {
        type: String,
        trim: true
    },

    // Health flag
    healthFlag: {
        type: String,
        enum: ["feed_delay", "no_diaper", "sleep_issue", "cry_excessive"],
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model("BabyActivity", babyActivitySchema);
