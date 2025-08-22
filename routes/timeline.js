const express = require("express");
const router = express.Router();
const {cookieJwtAuth, restrictTo} = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const timelineController = require("../controller/timeline.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.use(cookieParser());
router.use(cookieJwtAuth);


// READ - All timelines
router.get("/", wrapAsync(timelineController.index));

// CREATE - form, save
router.route("/create")
    .get(timelineController.create)
    .post(
        restrictTo("mother", "doctor"),
        wrapAsync(timelineController.newTimeline))

// UPDATE - Form, save changes
router.route("/:id/edit")
    .get( wrapAsync(timelineController.edit))
    .put(
        restrictTo("mother", "doctor"),
        wrapAsync(timelineController.update))

// DELETE
router.post("/:id/delete", restrictTo("doctor"), wrapAsync(timelineController.delete));

// timelineEvent
router.route("/:id/events")
    .get(wrapAsync(timelineController.getEvent))
    .post(
        restrictTo("mother", "doctor"),
        wrapAsync(timelineController.createEvent))

//show event
router.get("/:id/showEvent", wrapAsync(timelineController.showEvent))

//delete evnet
router.delete("/:id/delete", restrictTo("doctor"), wrapAsync(timelineController.deleteEvent))

//get ai response
router.post("/ai/response", wrapAsync(timelineController.aiResponse))

module.exports = router;