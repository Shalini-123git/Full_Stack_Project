const express = require("express");
const router = express.Router();
const { cookieJwtAuth, restrictTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const medicalHistoryController = require("../controller/medicalHistory.js");

router.use(cookieParser());
router.use(cookieJwtAuth);

//index
router.get("/", medicalHistoryController.index)

//create -> form, save
router.route("/create")
    .get(medicalHistoryController.newMedicalHistory)
    .post(
        restrictTo("mother", "doctor"),
        medicalHistoryController.create)

//show
router.get("/:id/show", medicalHistoryController.show)

//edit 
router.route("/:id/edit")
    .get(medicalHistoryController.edit)
    .put(
        restrictTo("mother", "doctor"),
        medicalHistoryController.update)

//delete
router.delete("/:id/delete", restrictTo("doctor"), medicalHistoryController.delete)


module.exports = router;