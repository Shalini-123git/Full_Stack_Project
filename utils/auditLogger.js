const { createLogger, format, transports } = require("winston");

const auditLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "logs/audit.log" }), // audit log file
    new transports.Console() // optional: see logs in console
  ],
});

module.exports = auditLogger;
