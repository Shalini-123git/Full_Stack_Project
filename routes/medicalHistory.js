const express = require("express");
const router = express.Router();
const { cookieJwtAuth, restrictTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const medicalHistoryController = require("../controller/medicalHistory.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.use(cookieParser());
router.use(cookieJwtAuth);

//index
router.get("/", wrapAsync(medicalHistoryController.index))

//create -> form, save
router.route("/create")
    .get(medicalHistoryController.newMedicalHistory)
    .post(
        restrictTo("mother", "doctor"),
        wrapAsync(medicalHistoryController.create))

//show
router.get("/:id/show", wrapAsync(medicalHistoryController.show))

//edit 
router.route("/:id/edit")
    .get(wrapAsync(medicalHistoryController.edit))
    .put(
        restrictTo("mother", "doctor"),
        wrapAsync(medicalHistoryController.update))

//delete
router.delete("/:id/delete", restrictTo("doctor"), wrapAsync(medicalHistoryController.delete))


module.exports = router;