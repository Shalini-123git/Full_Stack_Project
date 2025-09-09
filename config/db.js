const fs = require("fs");
const mongoose = require("mongoose");

function enableQueryLogger() {
  mongoose.set("debug", function (collectionName, method, query) {
    const start = Date.now();

    console.log(`[QUERY START] ${collectionName}.${method}`, query);

    setImmediate(() => {
      const duration = Date.now() - start;
      if (duration > 200) {
        const log = `[SLOW QUERY] ${collectionName}.${method} ${JSON.stringify(query)} took ${duration}ms\n`;
        fs.appendFileSync("logs/slow-queries.log", log);
        console.warn(log);
      }
    });
  });
}

module.exports = enableQueryLogger;