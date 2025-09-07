const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const path = require("path");

// fetch file buffer from Cloudinary URL
async function fetchFileBuffer(fileUrl) {
  const res = await axios.get(fileUrl, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
}

async function extractTextFromUrl(fileUrl) {
  const ext = path.extname(fileUrl).toLowerCase();

  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    const { data: { text } } = await Tesseract.recognize(fileUrl, "eng");
    return text;
  }

  if (ext === ".pdf") {
    const buffer = await fetchFileBuffer(fileUrl);
    const result = await pdfParse(buffer);

    if (result.text.trim().length > 0) return result.text;

    const { data: { text } } = await Tesseract.recognize(fileUrl, "eng");
    return text;
  }

  throw new Error("Unsupported file type");
}

module.exports = { extractTextFromUrl };
