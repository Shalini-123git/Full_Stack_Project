const express = require("express");
const router = express.Router();
const billController = require("../controller/bill.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { upload } = require("../cloudConfig.js")

// Render upload form
router.route("/upload")
    .get(billController.renderUploadForm)
    .post(
        upload.single("billFile"),
        wrapAsync(billController.uploadAndAnalyzeBill))
    
// List all bills
router.get("/list", wrapAsync(billController.listBills));

// Hospital cost comparison
router.get("/compare", wrapAsync(billController.compareHospitals));

// View bill details
router.get("/:id", wrapAsync(billController.getBillDetails));

module.exports = router;
