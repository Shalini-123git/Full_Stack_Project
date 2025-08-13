const express = require("express");
const router = express.Router();
const {cookieJwtAuth} = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const timelineController = require("../controller/timeline.js");

router.use(cookieParser());
router.use(cookieJwtAuth);


// READ - All timelines
router.get("/", timelineController.index);

// CREATE - form, save
router.route("/create")
    .get(timelineController.create)
    .post(timelineController.newTimeline)

// UPDATE - Form, save changes
router.route("/:id/edit")
    .get( timelineController.edit)
    .put(timelineController.update)

// DELETE
router.post("/:id/delete", timelineController.delete);

// timelineEvent
router.route("/:id/events")
    .get(timelineController.getEvent)
    .post(timelineController.createEvent)

//show event
router.get("/:id/showEvent", timelineController.showEvent)

//delete evnet
router.delete("/:id/delete", timelineController.deleteEvent)

//get ai response
router.post("/ai/response", timelineController.aiResponse)

module.exports = router;