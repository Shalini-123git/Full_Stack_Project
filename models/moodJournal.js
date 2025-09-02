const mongoose = require("mongoose");

const moodJournalSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    // Daily check-in mood via emoji
    moodEmoji: { 
        type: String, 
        enum: ["😊", "😐", "😔", "😟", "😴"], 
        required: true 
    },
    // Slider inputs
    stressLevel: { 
        type: Number, 
        min: 1, 
        max: 10 
    },
    energyLevel: { 
        type: Number, 
        min: 1, 
        max: 10 
    },
    // Notes & journaling
    gratitudeNote: { 
        type: String, 
        maxlength: 300 
    }, // “Today I’m grateful for…”
    stressNote: { 
        type: String, 
        maxlength: 300 
    }, // Stress triggers
    freeThoughts: { 
        type: String, 
        maxlength: 1000 
    }, // Journal log

    // CBT-based prompt (auto-delivered daily, optional response stored)
    cbtPrompt: { type: String },
    cbtResponse: { type: String },

    // Motivational / supportive messages
    scheduledMessage: { type: String }, // from spouse/family
}, { timestamps: true });

module.exports = mongoose.model("MoodJournal", moodJournalSchema);
