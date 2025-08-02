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

module.exports.authenticateUser = (req, res, next) => {
  const token = req.cookies.token; 
  
  if (!token) return res.status(401).json({ message: "Unauthorized" });
    
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports.createReportValidator = [

  //check not empty fields
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title should be under 100 characters"),

  check("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description should be under 500 characters"),

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
