const express = require("express");
const router = express.Router();

//call models
const Patient = require("../models/patient");
const Report = require("../models/report");
const Doctor = require("../models/doctor");
const Availability = require("../models/Availability");
const AdminReports = require("../models/adminreport");
const Appointment = require("../models/Appointment");

//Authenticate
const { ensureAuthenticatedadmin } = require("../config/auth");

// ViewPatients List
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/viewpatients", ensureAuthenticatedadmin, async (req, res) => {
  Patient.find().exec(async function (err, results) {
    var patientCount = results.length;

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi");
      await Patient.find({ name: regex }, function (err, patients) {
        if (err) {
          throw err;
        } else {
          if (patients.length < 1) {
            req.flash("error_msg", "Sorry! Patient not found");
            res.redirect("/viewpatients");
          } else {
            res.render("adminviewpatients", {
              patients,
              patientCount,
              user: req.user,
            });
            //});
          }
        }
      });
    } else {
      const patients = await Patient.find({});
      res.render("adminviewpatients", {
        patients,
        patientCount,
        user: req.user,
      });
    }
  });
});

//View Doctors
router.get("/viewdoctors", ensureAuthenticatedadmin, async (req, res) => {
  Doctor.find().exec(async function (err, results) {
    var doctorCount = results.length;

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
      await Doctor.find(
        {
          name: regex,
        },
        function (err, doctors) {
          // const doctors =  await Doctor.find({name:regex}){
          if (err) {
            //  Garnu jastai ho
            throw err;
          } else {
            if (doctors.length < 1) {
              req.flash(
                "error_msg",
                "Sorry! Doctor not found,please try again"
              );
              res.redirect("/viewdoctors");
            } else {
              res.render("adminviewdoctors", {
                doctorCount,
                doctors: doctors, //just doctors yo line ma incase --->const doctors
                user: req.user, //which is done above
              });
            }
          }
        }
      );
    } else {
      const doctors = await Doctor.find({});
      res.render("adminviewdoctors", {
        doctorCount,
        doctors,
        user: req.user,
      });
    }
  });
});

//view more details of patients

//Patient ID
router.param("id", function (req, res, next, _id) {
  Patient.findOne({ _id }, function (err, details) {
    if (err) throw err;
    else {
      req.patient = details;
      next();
    }
  });
});

//Particular report of patient (Uploaded by patient)
router.param("id", function (req, res, next, patientid) {
  Report.find({ patientid }, function (err, reports) {
    if (err) throw err;
    else {
      req.report = reports;
      next();
    }
  });
});

//Admin Reports for particular patient
router.param("id", function (req, res, next, patientidadmin) {
  AdminReports.find({ patientidadmin }, function (err, adminreports) {
    if (err) throw err;
    else {
      req.adminreport = adminreports;
      next();
    }
  });
});

//Landing Page for More details of patient
router.get("/viewpatients/:id", ensureAuthenticatedadmin, async (req, res) => {
  res.render("patientdetailsadmin", {
    patient: req.patient,
    user: req.user,
  });
});

//To see patient uploads
router.get(
  "/viewpatients/:id/patientUploads",
  ensureAuthenticatedadmin,
  async (req, res) => {
    res.render("patientUploads", {
      role: "Admin",
      images: req.report,
      patient: req.patient,
      user: req.user,
    });
  }
);

//To see previous uploads
router.get(
  "/viewpatients/:id/hospitalUploads",
  ensureAuthenticatedadmin,
  async (req, res) => {
    res.render("hospitalUploads", {
      role: "Admin",
      adminimages: req.adminreport,
      patient: req.patient,
      user: req.user,
    });
  }
);

//view more details of doctors

//Doctor id
router.param("id", function (req, res, next, _id) {
  Doctor.findOne({ _id }, function (err, details) {
    if (err) throw err;
    else {
      req.doctor = details;
      next();
    }
  });
});

//Particular availability
router.param("id", function (req, res, next, doctorid) {
  Availability.findOne({ doctorid }, function (err, available) {
    if (err) throw err;
    else {
      req.availability = available;
      next();
    }
  });
});

//To see doctors detail
router.get("/viewdoctors/:id", ensureAuthenticatedadmin, async (req, res) => {
  res.render("doctordetailsadmin", {
    availability: req.availability,
    doctor: req.doctor,
    user: req.user,
  });
});

module.exports = router;
