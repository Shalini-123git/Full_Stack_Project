const express = require("express");
const router = express.Router();
const userController = require("../controller/users.js");
const { validateLogin } = require("../middleware/validation.js");
const wrapAsync = require("../utils/wrapAsync.js");

//signUp
router.get("/", userController.index);
router.route("/signUp")
    .get(userController.signupRouter)
    .post(wrapAsync(userController.signupPostRouter))

//login
router.route("/login")
    .get(userController.loginRouter)
    .post(validateLogin, wrapAsync(userController.loginPostRouter));

router.get("/logout", userController.logoutRouter);

module.exports = router;