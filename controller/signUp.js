const User = require("../models/user");
const Report = require("../models/reports");

module.exports.signUp = (req, res) => {
    res.render("signUp.ejs");
};

module.exports.create = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).send("No file uploaded");
        }
        let data = req.body;
        const newUser = new User(data);
        await newUser.save();
        
        const { path: url, filename } = req.file;
        const user = await User.findOne({username: data.username}); 
        if(!user){
            throw new Error("User not found after signUp");
        }                               
        const newReport = new Report({
            userId: user._id,
            username: user.username,
            image:{
                url,
                filename,
            }
        });
        console.log(newReport);
        await newReport.save();
        res.send("sign up successful");
    } catch(err) {
        console.error("Error while saving data", err.message);
        res.status(500).send("Internal Server Error.");
    }
};

