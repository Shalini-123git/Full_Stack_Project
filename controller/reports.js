const Report = require("../models/reports.js");
const generatePdfFromRoute = require("../utils/pdfGenerator.js")
const auditLog = require("../utils/auditLog.js");

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

    await auditLog(req, "reports/create", {
        reportId: report._id,
        title: report.title
    });
    res.redirect("/report");

}

//index route
module.exports.index = async (req, res) => {
    const userId = req.user.user._id;
    const reports = await Report.find({userId}).populate("userId");

    //Audit log for viewing list
   await auditLog(req, "reports/view_list", { count: reports.length });

    res.render("reports/index.ejs", {reports, userId});
}

//Show Report
module.exports.show =  async (req, res) => {
    const { id } = req.params;
    const report = await Report.findById(id);

    // Audit log for viewing report
    await auditLog(req, "reports/view", {
        reportId: report._id,
        title: report.title
    });
    res.render("reports/show.ejs", {report});
}

//Print
module.exports.printView = async (req, res) => {
    const { id } = req.params;
    const report = await Report.findById(id);
    
     // Audit log for print view
    await auditLog(req, "reports/print_view", {
        reportId: report.id,
        title: report.title
    });
    res.render("reports/printView", {report});
}

module.exports.generatePdf = async (req, res) => {
    const url = `${req.protocol}://${req.get("host")}/report/${req.params.id}/printView`;
    const fileName = `Report.pdf`;

    // Audit log for PDF generation
    await auditLog(req, "reports/generate_pdf", { reportId: req.params.id });

    await generatePdfFromRoute(url, fileName, req, res);
}

//Edit Report
module.exports.edit = async (req, res) => {

    const report = await Report.findById(req.params.id);
    if (!report) return res.redirect("/report");

    // Audit log for accessing edit page
    await auditLog(req, "reports/edit_view", {
        reportId: report._id,
        title: report.title
    });
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

    // Audit log for update
    await auditLog(req, "reports/update", {
        reportId: report._id,
        title: report.title
    });
    res.redirect(`/report`);
}

//Delete Report
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);

    // Audit log for delete
    await auditLog(req, "reports/delete", {
        reportId: id,
        title: report?.title || "N/A"
    });
    res.redirect("/admin/report");
}

