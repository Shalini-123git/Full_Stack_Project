const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const checklistController = require("../controller/checklist");

// Get checklist by week
router.get("/:week", wrapAsync(checklistController.getWeekChecklist));

// Add checklist (for testing / seeding)
router.post("/", wrapAsync(checklistController.addChecklist));

module.exports = router;
