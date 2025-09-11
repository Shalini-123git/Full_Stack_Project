const express = require("express");
const router = express.Router();
const billController = require("../controller/bill.js");
const { cookieJwtAuth, accessTo } = require("../middleware/auth.js");
const cookieParser = require("cookie-parser");
const wrapAsync = require("../utils/wrapAsync.js");
const {upload} = require("../cloudConfig.js")

router.use(cookieParser());
router.use(cookieJwtAuth);

// Show upload form - Handle form submission
router.route("/upload")
    .get(billController.showUploadForm)
    .post(accessTo("mother", "admin"), upload.single("file"), wrapAsync(billController.uploadAndAnalyzeBill))

// Web Views
router.get("/view", accessTo("mother","doctor", "admin"), wrapAsync(billController.showAllBills));

router.get("/view/:id", wrapAsync(billController.showBillDetails));

router.delete("/view/:id", wrapAsync(billController.deleteBill))

module.exports = router;
