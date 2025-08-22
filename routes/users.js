const express = require("express");
const router = express.Router();
const userController = require("../controller/users.js");
const { validateLogin } = require("../middleware/validation.js");

//signUp
router.get("/", userController.index);
router.route("/signUp")
    .get(userController.signupRouter)
    .post(userController.signupPostRouter)

//login
router.route("/login")
    .get(userController.loginRouter)
    .post(validateLogin, userController.loginPostRouter);

router.get("/logout", userController.logoutRouter);

module.exports = router;