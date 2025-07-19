const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
    },
    image: {
        url: {
            type: String,
            required: true
        },
            filename: String,
    },
    uploadedAt: {
        type: Date,
        default: Date.now(),
    }  
});

module.exports = new mongoose.model("Report", reportSchema);
