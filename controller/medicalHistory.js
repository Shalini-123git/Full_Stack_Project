const MedicalHistory = require("../models/medicalHistory.js")

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
    try {
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
    } catch (err) {
        console.error("Error uploading report:", err);
        res.status(500).json({message: err.message});
    }
    
}

//show
module.exports.show = async (req, res) => {
    const { id } = req.params;
    const medicalHistory = await MedicalHistory.findById(id);
    
    res.render("medicalHistory/show.ejs", {medicalHistory});
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
    res.redirect("/medicalHistory");
}