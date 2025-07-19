const User = require("../models/user");
const jwt = require("jsonwebtoken");

//login 
module.exports.login = (req, res) => {
    res.render("login.ejs");
};

//post and verify by jwt
module.exports.post = async(req, res) => {
    const { username } = req.body;
    const user = await User.findOne( { username });
    console.log(user);
    if(!user){
        res.json("user not found.... please insert valid username, email and password");
    }else{
        const token = jwt.sign(
            {username},
            process.env.SECRET_KEY,
            {  expiresIn: "1h" },
        );
        const userVer = await jwt.verify(token, process.env.SECRET_KEY);
        console.log(userVer);
        res.json(userVer);
}
};

