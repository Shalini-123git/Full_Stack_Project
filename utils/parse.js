const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

// --- Fetch file buffer (local or remote) ---
async function fetchFileBuffer(fileUrl) {
  // Local file path (multer)
  if (!fileUrl.startsWith("http")) {
    return fs.readFileSync(fileUrl);
  }

  // Remote file (Cloudinary, etc.)
  const res = await axios.get(fileUrl, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
}

// --- Extract Text from file (pdf, image) ---
async function extractTextFromUrl(fileUrl, mimeType = "") {
  let ext = path.extname(fileUrl).toLowerCase();

  // Fallback: check mimeType if extension missing
  if (!ext && mimeType) {
    if (mimeType.includes("pdf")) ext = ".pdf";
    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = ".jpg";
    if (mimeType.includes("png")) ext = ".png";
  }

  // --- Images ---
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    const { data: { text } } = await Tesseract.recognize(fileUrl, "eng");
    return text;
  }

  // --- PDFs ---
  if (ext === ".pdf") {
    const buffer = await fetchFileBuffer(fileUrl);

    // First try pdf-parse (fast, accurate for digital PDFs)
    const result = await pdfParse(buffer);
    if (result.text.trim().length > 0) return result.text;

    // Fallback: OCR if scanned PDF
    const { data: { text } } = await Tesseract.recognize(fileUrl, "eng");
    return text;
  }

  throw new Error("Unsupported file type");
}

module.exports = { extractTextFromUrl };
