const express = require("express");
const router = express.Router();
const {cookieJwtAuth, restrictTo} = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const timelineController = require("../controller/timeline.js");

router.use(cookieParser());
router.use(cookieJwtAuth);


// READ - All timelines
router.get("/", timelineController.index);

// CREATE - form, save
router.route("/create")
    .get(timelineController.create)
    .post(
        restrictTo("mother", "doctor"),
        timelineController.newTimeline)

// UPDATE - Form, save changes
router.route("/:id/edit")
    .get( timelineController.edit)
    .put(
        restrictTo("mother", "doctor"),
        timelineController.update)

// DELETE
router.post("/:id/delete", restrictTo("doctor"), timelineController.delete);

// timelineEvent
router.route("/:id/events")
    .get(timelineController.getEvent)
    .post(
        restrictTo("mother", "doctor"),
        timelineController.createEvent)

//show event
router.get("/:id/showEvent", timelineController.showEvent)

//delete evnet
router.delete("/:id/delete", restrictTo("doctor"), timelineController.deleteEvent)

//get ai response
router.post("/ai/response", timelineController.aiResponse)

module.exports = router;