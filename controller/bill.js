const Bill = require("../models/bill");
const HospitalCost = require("../models/hospitalCost");
const fs = require("fs");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const axios = require("axios");

//parse bill
async function parseBillFile(fileUrl) {
  try {
    console.log("Fetching from Cloudinary:", fileUrl);

    // Download file from Cloudinary
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    // Parse PDF
    const pdfData = await pdfParse(Buffer.from(response.data));

    console.log("✅ PDF parsed successfully");
    return pdfData.text;
  } catch (err) {
    console.error("❌ PDF parsing failed:", err.message);
    throw new Error("Uploaded file is not a valid PDF or could not be parsed.");
  }
}

module.exports.uploadAndAnalyzeBill = async (req, res) => {
  const file = req.file;
  console.log(file) // file upload
  const data = req.body; // manual form data
  console.log(data)
  let parsedText = "";
  if (file) {
    parsedText = await parseBillFile(file.path, file.mimetype);
    fs.unlinkSync(file.path); // cleanup
  }

  // Calculate total
  const total = items.reduce((sum, i) => sum + parseInt(i.cost), 0);

  // Analyze against reference DB
  let overcharged = [];
  let fair = [];

  for (let item of items) {
    const ref = await HospitalCost.findOne({ item: item.name });
    if (ref) {
      if (item.cost > ref.avgCost * 1.5) {
        overcharged.push({
          item: item.name,
          charged: item.cost,
          avg: ref.avgCost,
          diff: item.cost - ref.avgCost,
        });
      } else {
        fair.push({
          item: item.name,
          charged: item.cost,
          avg: ref.avgCost,
        });
      }
    }
  }

  // Save bill
  const newBill = new Bill({
    hospital,
    items,
    total,
    analyzedReport: { overcharged, fair },
  });
  await newBill.save();

  // Return JSON API response
  res.json({
    success: true,
    billId: newBill._id,
    hospital,
    total,
    analyzedReport: { overcharged, fair },
    parsedText, // only if file was uploaded
  });
};

// Render upload form
module.exports.renderUploadForm = (req, res) => {
  res.render("bills/upload");
};

// List all bills
module.exports.listBills = async (req, res) => {
  const bills = await Bill.find();
  res.render("bills/list", { bills });
};

// Hospital cost comparison page
module.exports.compareHospitals = async (req, res) => {
  const hospitals = await HospitalCost.find({}); // can aggregate ethics ratings later
  console.log(hospitals);
  res.render("bills/compare", {hospitals});
};

// Bill details page
module.exports.getBillDetails = async (req, res) => {
  const { id} = req.params;
  console.log("this is id", id);
  const bill = await Bill.findById(id);
  console.log("generated bill", bill)
  res.render("bills/details", { bill });
};



