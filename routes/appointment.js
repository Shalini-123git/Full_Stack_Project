const express = require("express");
const router = express.Router();
const { cookieJwtAuth, accessTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const appointmentController = require("../controller/appointment.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.use(cookieParser());
router.use(cookieJwtAuth);

router.route("/create")
    .get(accessTo("mother", "doctor"), wrapAsync(appointmentController.newAppointment))
    .post(accessTo("mother", "doctor"), wrapAsync(appointmentController.create))

router.route("/:id")
    .get(appointmentController.show)
    .put(accessTo("mother", "doctor"), wrapAsync(appointmentController.update))

router.delete("/admin/:id", accessTo("doctor", "admin"), wrapAsync(appointmentController.delete))


router.get("/", wrapAsync(appointmentController.index))

router.get("/:id/edit", accessTo("mother", "doctor"), wrapAsync(appointmentController.edit))

module.exports = router;