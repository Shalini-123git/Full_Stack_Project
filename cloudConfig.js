const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const allowedFormats = ["image/jpg", "image/png", "image/jpeg", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        console.log("This is mime type" ,file.mimetype);
        if(!allowedFormats.includes(file.mimetype)) {
            const err = new Error("Given file format not allowed");
            err.http_code = 400;
            throw err;
        }

         // resource_type based on file type
        const isPdf = file.mimetype === "application/pdf";
        const isDocx = file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        return {
            folder: "Medical_Report",
            public_id: `${Date.now()}-${(req.user && req.user._id) || "unknown"}`,
            resource_type: isPdf || isDocx ? "raw" : "image",
        }
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        console.log("this is a file" ,file.originalname);
        const allowed = /pdf|jpg|jpeg|png|docx/;
        const ext = path.extname(file.originalname).toLowerCase();
            if (allowed.test(ext)) cb(null, true);
            else cb(new Error("Invalid file type"));
    }
});

module.exports = {
    upload,
    cloudinary,                            //from cloudinary.Config 
    storage,
}

