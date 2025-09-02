const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

module.exports.generateReport = async (req, res) => {
    try {
    const browser = await puppeteer.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // path to Chrome
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(`${req.protocol}://${req.get("host")}/timeline`, {
      waitUntil: "networkidle2",
    });

    await page.setViewport({ width: 1500, height: 1050 });

    // ✅ use single timestamp
    const timestamp = Date.now();

    // ✅ ensure folder exists
    const dir = path.join(__dirname, "../public/files");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const pdfPath = path.join(dir, `${timestamp}.pdf`);

    await page.pdf({
      path: pdfPath,
      printBackground: true,
      format: "A4",
    });

    await browser.close();

    // ✅ send file to client
    res.download(pdfPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      } else {
        // (Optional) delete file after sending to avoid clutter
        fs.unlink(pdfPath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      }
    });
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
}