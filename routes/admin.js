const express = require("express");
const router = express.Router();
const { cookieJwtAuth, restrictTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const Report = require("../models/reports.js");
const Appointment = require("../models/appointment.js");
const MedicalHistory = require("../models/medicalHistory.js");
const Timeline = require("../models/timeline.js");
const Checklist = require("../models/checklist.js");

router.use(cookieParser());
router.use(cookieJwtAuth);

router.get("/report", restrictTo("doctor", "admin"), async (req, res) => {
    const reports = await Report.find({});
    res.render("reports/index.ejs", {reports});
})

router.get("/medicalHistory", restrictTo("doctor", "admin"), async (req, res) => {
    const medicalHistories = await MedicalHistory.find({});
    res.render("medicalHistory/index.ejs", {medicalHistories});
})

router.get("/timeline", restrictTo("doctor", "admin"), async (req, res) => {
    const timeline = await Timeline.find({});
    res.render("timeline/index.ejs", {timeline});
})

router.get("/checklist", restrictTo("doctor", "admin"), async (req, res) => {
    const checklist = await Checklist.find({});
    res.status(200).json({message: checklist});
})

router.get("/appointments", restrictTo("doctor", "admin"), async (req, res) => {
    const appointment = await Appointment.find({}).populate("mother");
    res.render("appointment/index.ejs", {appointment});
})

module.exports = router;