const express = require("express");
const router = express.Router();
require("dotenv").config();
const cloudinary = require("cloudinary");

//call handlers and models
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const Report = require("../models/report");
const AdminReport = require("../models/adminreport");

const { ensureAuthenticated } = require("../config/auth");
const { ensureAuthenticatedadmin } = require("../config/auth");

//Upload Report patient
router.get("/uploadreport", ensureAuthenticated, (req, res) => {
  res.render("uploadreport", {
    user: req.user,
  });
});

//Admin upload particular patient
router.get("/adminupload/:id", ensureAuthenticatedadmin, (req, res) => {
  res.render("adminreport", {
    user: req.user,
  });
  ress = req.params.id;
  //console.log(ress);
});

//patient upload handle
router.post("/upload_reports", upload.single("image"), async (req, res) => {
  const { title } = req.body;

  let errors = [];

  if (!title) {
    errors.push({ msg: "Please fill in all required fields" });
  }

  if (errors.length > 0) {
    res.render("uploadreport", {
      errors,
      user: req.user,
      title,
    });
  } else {
    const report = new Report({ title });
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    report.title = req.body.title;
    report.imageUrl = result.secure_url;
    report.patientid = req.user._id;
    await report.save();
    res.redirect("/myuploads");
  }
});

//admin upload handle
router.post("/adminupload/:id", upload.single("image"), async (req, res) => {
  const { title } = req.body;

  let errors = [];

  if (!title) {
    errors.push({ msg: "Please fill in all required fields" });
  }

  if (errors.length > 0) {
    res.render("adminreport", {
      errors,
      user: req.user,
      title,
    });
  } else {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const adminreport = new AdminReport({ title });
    adminreport.title = req.body.title;
    adminreport.imageUrl = result.secure_url;
    adminreport.patientidadmin = ress;
    await adminreport.save();
    res.redirect("/viewpatients");
  }
});

//see uploaded reports
router.get("/myuploads", ensureAuthenticated, async (req, res) => {
  // Method 1
  // const user_id = req.user._id;
  // const patient = await Patient.findById(user_id);
  // const images = await Report.find({ "patientid": patient._id })

  // Method 2
  const images = await Report.find({ patientid: req.user._id });
  res.render("patientUploads", {
    role: "Patient",
    images,
    user: req.user,
  });
});

//See reports from hospital
router.get("/fromhospital", ensureAuthenticated, async (req, res) => {
  const adminimages = await AdminReport.find({ patientidadmin: req.user._id });
  res.render("hospitalUploads", {
    role: "Patient",
    adminimages,
    user: req.user,
  });
});

module.exports = router;
