const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username: {
        type: String,
    },
    password: {
        type: String,
    },
    age: {
        type: Number
    },
    image: {
        url: String,
        filename: String,
    },
    uploadedAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = new mongoose.model("User", userSchema);
