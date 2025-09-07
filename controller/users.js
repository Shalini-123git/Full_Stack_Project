const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auditLog = require("../utils/auditLog");

//index
module.exports.index = (req, res) => {
    res.render("users/index.ejs");
}

//login 
module.exports.loginRouter = (req, res) => {
    res.render("users/login.ejs");
};

//post request and verify by jwt
module.exports.loginPostRouter = async(req, res) => {
    
    const { username, password, role } = req.body;
    const user = await User.findOne( { username });
    if(!user){
        await auditLog(req, "auth/login_failed", { username });
        return res.json("user not found.... please insert valid username, email and password");
    }else{
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});
        const token = jwt.sign(
            {user},
            process.env.SECRET_KEY,
            {  expiresIn: "1h" },
        );

        //Check role matches stored role
        if (user.role !== role) {
            await auditLog(req, "auth/role_mismatch", { username, attemptedRole: role });
            return res.status(403).send("Role mismatch! Please select the correct role.");
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000000,
        })
        await auditLog(req, "auth/login_success", { username, role });
        res.redirect("/");
    }
};

module.exports.signupRouter = (req, res) => {
    res.render("users/signUp.ejs");
};

module.exports.signupPostRouter = async (req, res) => {
    //save User
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ $or: [{username}, {email}]});
    if(existingUser) return res.status(400).json({ message: "Username or email already exist"});

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username: username, 
        email: email, 
        password: hashedPassword,
        role: role
    });
    const savedUser = await newUser.save();
    await auditLog(req, "auth/signup_success", { username, email, role });
    res.render("users/login.ejs");
};

module.exports.logoutRouter = async (req, res, next) => {
    const {username, email, role} = req.params;
    await auditLog(req, "auth/logout_success", { username, email, role });
    res.clearCookie("token");
    res.redirect("/");
}