const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const { ensureAuthenticated1 } = require("../config/auth");
const { ensureAuthenticatedadmin } = require("../config/auth");

const Patient = require("../models/patient");
const Feedback = require("../models/feedback");
const Doctor = require("../models/doctor");

// Welcome Page
router.get("/", (req, res) => res.render("Home"));

//Welcome patient
router.get("/patient/welcome", (req, res) => res.render("welcome"));

// Welcome Doctor
router.get("/doctor/welcomedr", (req, res) => res.render("welcomedr"));

//Doctordashboard
router.get("/doctordashboard", ensureAuthenticated1, (req, res) => {
  res.render("doctordashboard", {
    user: req.user,
  });
});

//patientdashboard page
router.get("/patientdashboard", ensureAuthenticated, (req, res) => {
  res.render("patientdashboard", {
    user: req.user,
  });
});

//admindashboard page
router.get(
  "/admin/admindashboard",
  ensureAuthenticatedadmin,
  async (req, res) => {
    Patient.find().exec(function (err, results) {
      var patientCount = results.length;
      Doctor.find().exec(function (err, results) {
        var doctorCount = results.length;
        Feedback.find().exec(function (err, results) {
          var feedbackCount = results.length;
          res.render("admindashboard", {
            user: req.user,
            patientCount,
            doctorCount,
            feedbackCount,
          });
        });
      });
    });
  }
);
module.exports = router;
