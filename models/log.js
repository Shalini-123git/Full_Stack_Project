const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null if user not logged in
    },
    action: {
      type: String,
      required: true,
    },
    method: {
      type: String, // GET, POST, PUT, DELETE
    },
    url: {
      type: String,
    },
    ip: {
      type: String,
    },
    details: {
      type: Object, // flexible JSON
      default: {},
    },
  },
  { timestamps: true }
);

// TTL index (auto-delete logs older than 1 year)
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 * 12 });

module.exports = mongoose.model("Log", logSchema);
