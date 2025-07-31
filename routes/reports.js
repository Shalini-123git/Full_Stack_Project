const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

router.use(auth);

//show report
router.get("/show", async (req, res) => {
   res.render("reports/show.ejs");
});

//add new report
router.get("/create", (req, res) => {
    res.render("reports/create.ejs");
});

//post report
router.post("/create", (req, res) => {
    res.redirect("/reports/show");
})

//edit report
router.get("/edit", (req, res) => {
    res.render("reports/edit.ejs");
});

//delete report
router.get("/delete", (req, res) => {
    res.redirect("/report/show");
});

module.exports = router;