const Report = require("../models/reports.js");

//Create New Report
module.exports.newReport = (req, res) => {
    res.render("reports/create.ejs");
}

//Post New Report
module.exports.create = async(req, res) => {
    
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const userId = req.user.user._id;
    const { title, description} = req.body;
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
        
    await report.save();      //save report

    res.redirect("/report");

}

//index route
module.exports.index = async (req, res) => {
    const userId = req.user.user._id;
    console.log("this is current user", userId);
    const reports = await Report.find({userId}).populate("userId");
    console.log(reports);
    res.render("reports/index.ejs", {reports, userId});
}

//Show Report
module.exports.show =  async (req, res) => {
    const { id } = req.params;
    const report = await Report.findById(id);
    res.render("reports/show.ejs", {report});
}

//Edit Report
module.exports.edit = async (req, res) => {

    const report = await Report.findById(req.params.id);
    if (!report) return res.redirect("/report");
    res.render("reports/edit.ejs", { report});
}

//Update Report
module.exports.update = async (req, res) => {
    let { id } = req.params;
    let report = await Report.findByIdAndUpdate(id, {...req.body});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        report.file = { url, filename };
        await report.save();
    }
    res.redirect(`/report`);
}

//Delete Report
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    res.redirect("/report");
}

