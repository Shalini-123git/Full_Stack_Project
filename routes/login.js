const express = require("express");
const router = express.Router();

const loginController = require("../controller/login");

//login route
router.get("/", loginController.login);

//post route
router.post("/", loginController.post);

module.exports = router;