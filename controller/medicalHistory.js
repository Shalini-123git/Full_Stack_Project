const MedicalHistory = require("../models/medicalHistory.js");
const generatePdfFromRoute = require("../utils/pdfGenerator.js");

//index
module.exports.index = async (req, res) => {
    const userId = req.user.user._id;
    
    const medicalHistories = await MedicalHistory.find({userId}).populate("userId");
    res.render("medicalHistory/index.ejs", {medicalHistories, userId});
}

//create -> new
module.exports.newMedicalHistory = (req, res) => {
    res.render("medicalHistory/create.ejs");
}

//create -> save
module.exports.create = async (req, res) => {
    
    if(!req.user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const userId = req.user.user._id;
    const data = req.body;
    const { pregnancyStartDate, bloodType } = req.body;
    const newMedicalHistory = new MedicalHistory({
        userId, 
        pregnancyStartDate,
        bloodType,
        data
    });
    console.log(newMedicalHistory)
    await newMedicalHistory.save();

    res.redirect("/medicalHistory");
    
}

//show
module.exports.show = async (req, res) => {
    const { id } = req.params;
    const medicalHistory = await MedicalHistory.findById(id);
    
    res.render("medicalHistory/show.ejs", {medicalHistory});
}

//Print
module.exports.printView = async (req, res) => {
    const { id } = req.params;
    const medicalHistory = await MedicalHistory.findById(id);
    
    res.render("medicalHistory/printView", {medicalHistory});
}

module.exports.generatePdf = async (req, res) => {
    const url = `${req.protocol}://${req.get("host")}/medicalHistory/${req.params.id}/printView`;
    const fileName = `MedicalHistory.pdf`;

    await generatePdfFromRoute(url, fileName, req, res);
}

//edit
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const medicalHistory = await MedicalHistory.findById(id);

    if(!medicalHistory) {
        res.redirect("/medicalHistory");
    }
    
    res.render("medicalHistory/edit.ejs", { medicalHistory });
}
 
//update
module.exports.update = async (req, res) => {
    let { id } = req.params;
    let updatedReportHistory = await MedicalHistory.findByIdAndUpdate(id, {...req.body});
 
    console.log(updatedReportHistory);
    res.redirect(`/medicalHistory`);
}

//delete
module.exports.delete = async (req, res) => {
    await MedicalHistory.findByIdAndDelete(req.params.id);
    res.redirect("/admin/medicalHistory");
}