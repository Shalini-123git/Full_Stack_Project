const express = require("express");
const router = express.Router();
const {cookieJwtAuth, restrictTo} = require("../middleware/auth.js");
const {upload} = require("../cloudConfig.js");
const { createReportValidator } = require("../middleware/validation.js");
const cookieParser = require("cookie-parser");
const reportController = require("../controller/reports.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.use(cookieParser());
router.use(cookieJwtAuth);

//add new report
router.route("/create")
    .get(reportController.newReport)
    .post(
        restrictTo("mother", "doctor"),
        upload.single("file"), 
        createReportValidator, 
        wrapAsync(reportController.create)
    )

//index route
router.get("/", wrapAsync(reportController.index))

//show report - update report - delete report
router.route("/:id")
    .get(reportController.show)
    .put(
        restrictTo("mother", "doctor"),
        upload.single("file"), 
        createReportValidator, 
        wrapAsync(reportController.update)
    )
    .delete(restrictTo("doctor"), wrapAsync(reportController.delete))

//edit report
router.get("/:id/edit", wrapAsync(reportController.edit))

module.exports = router;