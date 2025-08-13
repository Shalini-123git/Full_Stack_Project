const jwt = require("jsonwebtoken");

module.exports.cookieJwtAuth = (req, res, next) => {
    
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        console.log(req.user);
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(401).render("users/login.ejs", {message: "Invalid Or expired token"});
    }
}
