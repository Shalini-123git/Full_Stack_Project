const express = require("express");
const router = express.Router();
const { cookieJwtAuth, restrictTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const appointmentController = require("../controller/appointment.js")

router.use(cookieParser());
router.use(cookieJwtAuth);

router.route("/create")
    .get(restrictTo("mother", "doctor"), appointmentController.newAppointment)
    .post(restrictTo("mother", "doctor"), appointmentController.create)

router.route("/:id")
    .get(appointmentController.show)
    .put(restrictTo("mother", "doctor"), appointmentController.update)
    .delete(restrictTo("doctor"), appointmentController.delete)


router.get("/", appointmentController.index)

router.get("/:id/edit", restrictTo("mother", "doctor"), appointmentController.edit)

module.exports = router;