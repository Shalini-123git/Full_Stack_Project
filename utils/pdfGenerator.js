const puppeteer = require("puppeteer");
const path = require("path");

async function generatePdfFromRoute(url, filename, req, res){
    console.log("Chromium executable path:", puppeteer.executablePath()); // debug log
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    });
    
    const page = await browser.newPage();
    
    if (req.headers.cookie) {
        const cookies = req.headers.cookie.split(";").map(c => {
        const [name, ...rest] = c.trim().split("=");
        return {
            name,
            value: rest.join("="),
            domain: req.hostname, // adjust if using custom domain
        };
        });
        await page.setCookie(...cookies);
    }
        
    await page.goto(url, {waitUntil: "networkidle2"});
    
    await page.setViewport({ width: 1500, height: 1050 });
    
    const todayDate = new Date();
    
    const pdfn = await page.pdf({
        path: `${path.join(__dirname, "../public/files", todayDate.getTime()+".pdf")}`,
        printBackground: true,
        formet: "A4"
    });
    
    await browser.close();
    
    const pdfUrl = path.join(__dirname, "../public/files", todayDate.getTime()+".pdf");
        
    res.download(pdfUrl, filename, function(err){
        if(err) {
            console.log(err);
        }
    })
}

module.exports = generatePdfFromRoute;