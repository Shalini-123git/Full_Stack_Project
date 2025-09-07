const auditLogger = require("./auditLogger");
const Log = require("../models/log"); // MongoDB log model

async function auditLog(req, action, details = {}) {
  try {
    const userId = req.user ? req.user._id : null;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const method = req.method;

    const logEntry = {
      userId,
      action,
      method,
      ip,
      details,
    };

    // Save to MongoDB
    await Log.create(logEntry);

    // Save to file/console
    auditLogger.info(logEntry);

  } catch (err) {
    console.error("Audit logging failed:", err);
  }
}

module.exports = auditLog;
