if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Report = require("./models/reports.js");
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({storage});
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MongoStore = require("connect-mongo");

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
    saveUninitialized: true
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));

//index route
app.get("/", (req, res) => {
    res.render("index.ejs");
})

//login
app.get("/login", (req, res) => {
    res.render("login.ejs");
})

//post route -> login
app.post("/login", async(req, res) => {
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
});

//signUp
app.get("/signUp", (req, res) => {
    res.render("signUp.ejs");
})

//post route -> signUp
app.post("/signUp/post",upload.single("image"), async (req, res, err) => {
    try {
        if(!req.file){
            return res.status(400).send("No file uploaded");
        }
        const {path: url, filename } = req.file;
        let data = req.body;
        console.log(data);
        const newReport = new Report({url, filename});
        const newUser = new User(data);
        newUser.image = {url, filename};
        
        await newUser.save();
        await newReport.save();

        res.send("sign up successful", {url, filename});
    } catch {
        console.error("Error while saving data", err);
        res.status(500).send("Internal Seerver Error.");
    }
})

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});