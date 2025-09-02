const express = require("express");
const router = express.Router();
const feedbackController = require("../controller/feedback");
const { cookieJwtAuth, isAdmin, restrictTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const wrapAsync = require("../utils/wrapAsync.js")

router.use(cookieParser());
router.use(cookieJwtAuth);

router.get("/", restrictTo("mother"), feedbackController.index)

// Gov dashboard
router.get("/gov/view", isAdmin, wrapAsync(feedbackController.viewGovDashboard));

router.post("/create", restrictTo("mother"), wrapAsync(feedbackController.createFeedback))

module.exports = router;
