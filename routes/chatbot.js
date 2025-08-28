const express = require("express");
const router = express.Router();
const { handleIncomingMessage } = require("../controller/chatbot.js");
const bodyParser = require("body-parser");

// Parse Twilio webhook
router.use(bodyParser.urlencoded({ extended: false }));


// POST webhook for Twilio
router.post("/chatbot", handleIncomingMessage);

module.exports = router;
