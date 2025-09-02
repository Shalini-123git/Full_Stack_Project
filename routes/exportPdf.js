const express = require("express");
const router = express.Router();
const exportController = require("../controller/exportPdf.js");
const cookieParser = require("cookie-parser");
const {cookieJwtAuth} = require("../middleware/auth.js")

router.use(cookieParser());
router.use(cookieJwtAuth)

router.get("/pdf", exportController.generateReport);

module.exports = router;
