const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

module.exports.validateLogin = [

  // check not empty fields
  check("username").not().isEmpty().trim().escape(),
  check("password").not().isEmpty().trim().escape(),
  
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
