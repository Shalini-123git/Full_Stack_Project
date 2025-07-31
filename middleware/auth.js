const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        if(typeof bearerHeader != "undefined"){
            const token = bearerHeader.split(" ")[1];
            const user = jwt.verify(token, process.env.SECRET_KEY);
            console.log(user);
            req.token = user;
            next()
        }else{
            res.status(401).json({message: "No Token Provided"});
        }
    } catch (err) {
        res.status(400).json({message: "Invalid or expired token"});
    }
}

module.exports = auth;