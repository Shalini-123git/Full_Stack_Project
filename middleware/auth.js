const jwt = require("jsonwebtoken");

module.exports.cookieJwtAuth = (req, res, next) => {
    
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect("/signUp");
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        console.log(req.user);
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(401).render("users/signUp.ejs", {message: "Invalid Or expired token"});
    }
}

// Middleware to restrict access to certain role (...roles) -> allowed
module.exports.accessTo = (...roles) => {
    return (req, res, next) => {
        console.log("user", req.user, req.user.user.role)
        if (!req.user || !roles.includes(req.user.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to perform this action"
            });
        }
        next();
    };
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.user.role === "admin") {
    return next(); // allow access
  } else{
    return res.status(403).json({
      message: "Access denied, only admin can access this"
  });
  }
};
