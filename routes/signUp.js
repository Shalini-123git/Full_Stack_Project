const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

const registerController = require("../controller/signUp.js");

//signIn route
router.get("/", registerController.signUp);

//create route
router.post("/post", upload.single("image"), registerController.create);

module.exports = router;