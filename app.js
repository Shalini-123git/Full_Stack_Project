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
const userLogin = require("./routes/login.js");
const userSignUp = require("./routes/signUp.js");

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

app.use("/login", userLogin);
app.use("/signUp", userSignUp);

//index route
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});