if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const sessionOptions = require("./config/session.js");
const customCron = require("./cron.js");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const enableQueryLogger = require("./config/db.js");

//log query on console
enableQueryLogger();

main()
   .then(() => {
      console.log("connected to db");
   })
   .catch( (err) => {
      console.log(err);
   });

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.engine("ejs", ejsMate);
app.use(cookieParser());

//check current logged-in user and store user in locals
app.use((req, res, next) => {
    if (req.cookies.token) {
        try {
            const user = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
            res.locals.currUser = user;
            res.locals.currUserRole = user.user.role;
        } catch (err) {
        res.locals.currUser = null;
        res.locals.currUserRole = null;
        }
    } else {
        res.locals.currUser = null;
        res.locals.currUserRole = null;
    }
    next();
});

//backup function call everyday at 2 AM
customCron.backUp(process.env.ATLASDB_URL);

//function call for email send
customCron.sendMailAllUser();

app.use("/", require("./routes/users"));
app.use("/report", require("./routes/reports"));
app.use("/timeline", require("./routes/timeline"));
app.use("/medicalHistory", require("./routes/medicalHistory"));
app.use("/appointments", require("./routes/appointment"));
app.use("/activities", require("./routes/babyActivity"));
app.use("/api", require("./routes/chatbot"));
app.use("/api/checklist", require("./routes/checklist"));
app.use("/admin", require("./routes/admin"));
app.use("/bills", require("./routes/bill"));
app.use("/moodjournal", require("./routes/moodJournal"));
app.use("/feedback", require("./routes/feedback"));

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});