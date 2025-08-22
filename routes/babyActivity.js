const express = require("express");
const router = express.Router();
const { cookieJwtAuth, restrictTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const babyActivityController = require("../controller/babyActivity.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.use(cookieParser());
router.use(cookieJwtAuth);

router.get("/", wrapAsync(babyActivityController.index))

// Create new activity (feed/sleep/diaper/cry)
router.route("/create")
    .get(restrictTo("mother", "caregiver"), wrapAsync(babyActivityController.newActivity))
    .post(restrictTo("mother", "caregiver"), wrapAsync(babyActivityController.createActivity))

// get all baby activity -> update activity -> delete activity
router.route("/:id")
    .get(babyActivityController.show)
    .put(restrictTo("mother", "caregiver"), wrapAsync(babyActivityController.updateActivity))
    .delete(restrictTo("mother", "caregiver"), wrapAsync(babyActivityController.deleteActivity))

// Get single activity
router.get("/:id/edit", restrictTo("mother", "caregiver"), wrapAsync(babyActivityController.edit));

module.exports = router;
