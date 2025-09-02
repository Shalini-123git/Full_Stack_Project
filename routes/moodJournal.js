const express = require("express");
const router = express.Router();
const moodJournalController = require("../controller/moodJournal.js");
const { cookieJwtAuth } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");

router.use(cookieParser());
router.use(cookieJwtAuth);

router.get("/", (req, res) => {
    res.render("moodjournal/new.ejs")
})
// POST /mood/create
router.post("/create", moodJournalController.createEntry);

// GET /mood/view
router.get("/view", moodJournalController.getEntries);

// DELETE /mood/delete/:id
router.delete("/delete/:id", moodJournalController.deleteEntry);

module.exports = router;
