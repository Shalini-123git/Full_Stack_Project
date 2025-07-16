const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // },
    url: {
        type: String,
        required: true
    },
    filename: String,
    uploadedAt: {
        type: Date,
        default: Date.now(),
    }  
});

module.exports = new mongoose.model("Report", reportSchema);
