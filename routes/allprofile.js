const express = require("express");
const router = express.Router();
require("dotenv").config();
const cloudinary = require("cloudinary");

//call models and handlers
require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Admin = require("../models/admin");

//Authentication
const { ensureAuthenticated } = require("../config/auth");
const { ensureAuthenticated1 } = require("../config/auth");
const { ensureAuthenticatedadmin } = require("../config/auth");

//patient profile page
router.get("/patientprofile", ensureAuthenticated, async (req, res) => {
  res.render("patientprofile", {
    user: req.user,
  });
});

// Upload profile photo patient
router.post("/change_avatar", upload.single("image"), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const profile = await Patient.findByIdAndUpdate({ _id: req.user._id });
  profile.imageUrl = result.secure_url;
  await profile.save();
  res.redirect("/patientprofile");
});

// for extraction of data from different models
// const user_id = req. user._id;
// const patient = await Patient.findById(user_id);
// const profileimage = await Patient.find({"patientid" : patient._id})

//doctor profile page
router.get("/doctorprofile", ensureAuthenticated1, async (req, res) => {
  res.render("doctorprofile", {
    user: req.user,
  });
});

// Upload profile photo doctor
router.post(
  "/change_avatar_doctor",
  upload.single("image"),
  async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const profile = await Doctor.findByIdAndUpdate({ _id: req.user._id });
    profile.imageUrl = result.secure_url;
    await profile.save();
    res.redirect("/doctorprofile");
  }
);

//admin profile page
router.get("/adminprofile", ensureAuthenticatedadmin, (req, res) => {
  res.render("adminprofile", {
    user: req.user,
  });
});

//admin profile photo
router.post(
  "/change_avatar_admin",
  upload.single("image"),
  async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const profile = await Admin.findByIdAndUpdate({ _id: req.user._id });
    profile.imageUrl = result.secure_url;
    await profile.save();
    res.redirect("/adminprofile");
  }
);

module.exports = router;
