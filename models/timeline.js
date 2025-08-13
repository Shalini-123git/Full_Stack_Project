const mongoose = require("mongoose");

const timelineEventSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    eventDate: { 
        type: Date, 
        required: true 
    },
    category: { 
        type: String, 
        enum: ["Checkup", "Ultrasound", "Lab Test", "Vaccination", "Symptom", "Custom"], 
        default: "Custom" 
    },
    weekOfPregnancy: { 
        type: Number, 
        min: 1, 
        max: 42 
    },
    notes: String,
    attachments: [
        {
            url: String,       // File link or storage path
            filename: String
        }
    ]
});

const timelineSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    pregnancyStartDate: { 
        type: Date, 
        required: true 
    },
    dueDate: Date,
    events: [timelineEventSchema],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

timelineSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = new mongoose.model("Timeline", timelineSchema);
