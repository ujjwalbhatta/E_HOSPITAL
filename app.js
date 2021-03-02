const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const nocache = require("nocache");
const app = express();

//middlewares
app.use(expresslayouts);
app.set("view engine", "ejs");
app.use("/public/images/", express.static("./public/images"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(flash());
app.use(
  session({
    secret: "secret", //can be whatever
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(nocache());

//Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//mongodb
const db = require("./config/keys").MongoURI;
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDb connected.."))
  .catch((err) => console.log(err));

//Call routes
app.use("/", require("./routes/index"));
app.use("/patient", require("./routes/patient"));
app.use("/doctor", require("./routes/doctor"));
app.use("/", require("./routes/admin"));
app.use("/", require("./routes/reports"));
app.use("/", require("./routes/feedback"));
app.use("/", require("./routes/doctorcontrols"));
app.use("/", require("./routes/admincontrols"));
app.use("/", require("./routes/appointment"));
app.use("/", require("./routes/allprofile"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
