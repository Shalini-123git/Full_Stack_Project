const express = require("express");
const router = express.Router();
const { cookieJwtAuth, restrictTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const babyActivityController = require("../controller/babyActivity.js");

router.use(cookieParser());
router.use(cookieJwtAuth);

router.get("/", babyActivityController.index)

// Create new activity (feed/sleep/diaper/cry)
router.route("/create")
    .get(restrictTo("mother", "caregiver"), babyActivityController.newActivity)
    .post(restrictTo("mother", "caregiver"), babyActivityController.createActivity)

// get all baby activity -> update activity -> delete activity
router.route("/:id")
    .get(babyActivityController.show)
    .put(restrictTo("mother", "caregiver"), babyActivityController.updateActivity)
    .delete(restrictTo("mother", "caregiver"), babyActivityController.deleteActivity)

// Get single activity
router.get("/:id/edit", restrictTo("mother", "caregiver"), babyActivityController.edit);

module.exports = router;
