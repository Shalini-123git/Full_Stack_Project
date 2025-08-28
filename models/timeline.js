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

const milestoneSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true
    },
    description: String,
    status: { 
        type: String, 
        enum: ["pending", "completed", "skipped"], 
        default: "pending" 
    },
    dueDate: Date
});

const pregnancyMilestoneSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: true,
        min: 1, 
        max: 42
    },
    trimester: {
        type: String,
        enum: ["First", "Second", "Third"],
        required: true,
    },
    milestones: [milestoneSchema]
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
    weeks: [pregnancyMilestoneSchema],
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
