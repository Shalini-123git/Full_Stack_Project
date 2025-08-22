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
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/users.js");
const reports = require("./routes/reports.js");
const timelines = require("./routes/timeline.js");
const reportHistory = require("./routes/medicalHistory.js");
const babyLogs = require("./routes/babyActivity.js");
const appointments = require("./routes/appointment");
const customCron = require("./cron.js");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const dbUrl = process.env.ATLASDB_URL;

main()
   .then(() => {
      console.log("connected to db");
   })
   .catch( (err) => {
      console.log(err);
   });

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, maxAge: 1000*60*60*24}  //1 day
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


//function call for email send
customCron.sendMailAllUser();

//middleware for routes
app.use("/", userRouter);

// reports route
app.use("/report", reports);

// timeline
app.use("/timeline", timelines);

//report History
app.use("/medicalHistory", reportHistory);

//appointments
app.use("/appointments", appointments);

//baby Activity
app.use("/activities", babyLogs);

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});