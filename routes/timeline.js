const express = require("express");
const router = express.Router();
const {cookieJwtAuth, accessTo} = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const timelineController = require("../controller/timeline.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.use(cookieParser());
router.use(cookieJwtAuth);


// READ - All timelines
router.get("/", wrapAsync(timelineController.index));

router.get("/printView", wrapAsync(timelineController.printView))
router.get("/generatePdf", wrapAsync(timelineController.generatePdf))

// CREATE - form, save
router.route("/create")
    .get(timelineController.create)
    .post(
        accessTo("mother", "doctor"),
        wrapAsync(timelineController.newTimeline))

// UPDATE - Form, save changes
router.route("/:id/edit")
    .get( wrapAsync(timelineController.edit))
    .put(
        accessTo("mother", "doctor"),
        wrapAsync(timelineController.update))

// DELETE
router.post("/:id/delete", accessTo("doctor"), wrapAsync(timelineController.delete));

// timelineEvent
router.route("/:id/events")
    .get(wrapAsync(timelineController.getEvent))
    .post(
        accessTo("mother", "doctor"),
        wrapAsync(timelineController.createEvent))

//show event
router.get("/:id/showEvent", wrapAsync(timelineController.showEvent))

//delete evnet
router.delete("/:id/delete", accessTo("doctor"), wrapAsync(timelineController.deleteEvent))

//get ai response
router.post("/ai/response", wrapAsync(timelineController.aiResponse))

module.exports = router;