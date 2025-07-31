const express = require("express");
const { check, validationResult } = require("express-validator");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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