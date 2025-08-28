const express = require("express");
const router = express.Router();
const { cookieJwtAuth, restrictTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const appointmentController = require("../controller/appointment.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.use(cookieParser());
router.use(cookieJwtAuth);

router.route("/create")
    .get(restrictTo("mother", "doctor"), wrapAsync(appointmentController.newAppointment))
    .post(restrictTo("mother", "doctor"), wrapAsync(appointmentController.create))

router.route("/:id")
    .get(appointmentController.show)
    .put(restrictTo("mother", "doctor"), wrapAsync(appointmentController.update))

router.delete("/admin/:id", restrictTo("doctor"), wrapAsync(appointmentController.delete))


router.get("/", wrapAsync(appointmentController.index))

router.get("/:id/edit", restrictTo("mother", "doctor"), wrapAsync(appointmentController.edit))

module.exports = router;