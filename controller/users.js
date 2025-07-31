const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//login 
module.exports.loginRouter = (req, res) => {
    res.render("users/login.ejs");
};

//post request and verify by jwt
module.exports.loginPostRouter = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne( { username });
        console.log(user);
        if(!user){
            return res.json("user not found.... please insert valid username, email and password");
        }else{
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});
            const token = jwt.sign(
                { userId: user._id, username: user.username},
                process.env.SECRET_KEY,
                {  expiresIn: "1h" },
            );
            console.log(token);
            res.send("Token generated successfully")
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

module.exports.signupRouter = (req, res) => {
    res.render("users/signUp.ejs");
};

module.exports.signupPostRouter = async (req, res) => {
    try {
        //save User
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{username}, {email}]});
        if(existingUser) return res.status(400).json({ message: "Username or email already exist"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username, 
            email: email, 
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.send("User signedUp successfully");

    } catch(err) {
        console.error("Error while saving data", err.message);
        res.status(500).json({message: err.message});
    }
};

module.exports.logoutRouter = (req, res, next) => {
    res.send("logged out");
}