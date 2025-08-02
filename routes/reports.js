const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const Report = require("../models/reports.js");
const {upload} = require("../cloudConfig.js");
const { authenticateUser, createReportValidator } = require("../middleware/validation.js");

router.use(auth);

//index route
router.get("/",(req, res) => {
    res.render("reports/index.ejs");

})

//show report
router.get("/show", async (req, res) => {
    res.render("reports/show.ejs");
});

//add new report
router.get("/create", (req, res) => {
    res.render("reports/create.ejs");
});

//post report
router.post("/create", authenticateUser, upload.single("file"), createReportValidator, async(req, res) => {
    try {
        if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        const { userId } = req.user;
        const { title, description} = req.body;
        console.log(title, description);
        if (!req.file) return res.status(400).send("No file uploaded");
        const { path: url, filename } = req.file;

        const report = new Report({
            userId,
            title,
            description,
            file: {
                url,
                filename,
            }
        });
        console.log(report);
        await report.save();      //save report

        res.render("reports/show.ejs", {report});

    } catch (err) {
        console.error("Error uploading report:", err);
        res.status(500).json({message: err.message});
    }
})

//edit report
router.get("/edit", (req, res) => {
    res.render("reports/edit.ejs");
});

router.put("/edit", (req, res) => {
    res.send("edited");
})

//delete report
router.delete("/delete", (req, res) => {
    res.send("Report deleteed");
});

module.exports = router;