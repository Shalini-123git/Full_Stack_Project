const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");
// const { billSchema, appointmentSchema, babyActivitySchema, feedbackSchema, checklistSchema, 
//     medicalHistorySchema, reportSchema, timelineSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

module.exports.registerValidator = [
    check("username", "username is required").not().isEmpty(),
    check("email", "please include a valid email").isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check("password", "password is required").not().isEmpty().trim(),
]

module.exports.validateLogin = [

  // check not empty fields
  check("username", "username is required").not().isEmpty(),
  check("password", "password is required").not().isEmpty().trim(),
  check("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["mother", "caregiver", "doctor", "baby", "admin"]),
  
  //check validation error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: "form validation error",
        errors: errors.array()
      });
    } 
    next();
  }
];

module.exports.createReportValidator = [

  //check not empty fields
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  check("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  
    //check validation error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: "form validation error",
        errors: errors.array()
      });
    } 
    next();
  }
];