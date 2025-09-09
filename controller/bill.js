const { extractTextFromUrl } = require("../utils/parse.js");
const Bill = require("../models/bill.js");
const auditLog = require("../utils/auditLog.js");

// Parse hospital bill text
function parseHospitalBill(text) {
  const totalMatch = text.match(/Total\s*[:\-]?\s*₹?([\d,]+)/i);
  const patientMatch = text.match(/Patient\s*Name[:\-]?\s*(.*)/i);

  return {
    patientName: patientMatch ? patientMatch[1].trim() : "Unknown",
    totalAmount: totalMatch ? parseInt(totalMatch[1].replace(/,/g, "")) : 0,
    rawText: text,
  };
}

// Analyze costs
function analyzeCosts(data) {
  let warnings = [];
  if (data.totalAmount > 100000) {
    warnings.push("High bill amount! Consider insurance claim verification.");
  }
  return { warnings };
}

// Upload + Analyze Bill
exports.uploadAndAnalyzeBill = async (req, res) => {
  try {
    const userId = req.user?.user?._id || null;
    if (!userId) return res.status(401).send("Unauthorized: Please login");

    // Input: Either file URL or uploaded file
    let filePathOrUrl;
    let mimeType = "";

    if (req.body.fileUrl) {
      filePathOrUrl = req.body.fileUrl;
    } else if (req.file) {
      filePathOrUrl = req.file.path;
      mimeType = req.file.mimetype;
    } else {
      return res.status(400).send("No file or URL provided");
    }

    // Step 1: Extract text
    const text = await extractTextFromUrl(filePathOrUrl, mimeType);

    // Step 2: Parse + analyze
    const parsedData = parseHospitalBill(text);
    const analysis = analyzeCosts(parsedData);

    // Step 3: Save bill
    const bill = new Bill({
      ...parsedData,
      analysis,
      fileUrl: filePathOrUrl,
      userId,
    });
    await bill.save();

    // Step 4: Audit log
    await auditLog(req, "bill/upload", {
      billId: bill._id,
      patientName: parsedData.patientName,
      totalAmount: parsedData.totalAmount,
    });

    // Step 5: Respond
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.json({ success: true, bill });
    } else {
      res.redirect("/bills/view");
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("Error analyzing bill: " + err.message);
  }
};

// Show Upload Form
exports.showUploadForm = (req, res) => {
  res.render("bills/upload", { user: req.user.user });
};

// Show all bills
exports.showAllBills = async (req, res) => {
    const bills = await Bill.find({userId: req.user.user._id}).sort({ createdAt: -1 });

    await auditLog(req, "bill/list", { count: bills.length });
    res.render("bills/list", { bills });
};

// Web View: Show single bill
exports.showBillDetails = async (req, res) => {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).send("Bill not found");

    await auditLog(req, "bill/view", {
      billId: bill._id,
      totalAmount: bill.totalAmount
    });
    res.render("bills/details", { bill });
};

module.exports.deleteBill = async (req, res) => {
  const { id } = req.params;
      await Bill.findByIdAndDelete(id);
  
      // Audit log for delete
      await auditLog(req, "bill/delete", {
          billId: id
      });
      res.redirect(`/bills/view`);
}

