const express = require("express");
const router = express.Router();

//authenticate
const { ensureAuthenticated1 } = require("../config/auth");

//call models
const Patient = require("../models/patient");
const Report = require("../models/report");
const Availability = require("../models/Availability");
const AdminReport = require("../models/adminreport");

//See own availability
router.get("/doctor/availability", ensureAuthenticated1, async (req, res) => {
  const availData = await Availability.findOne({ doctorid: req.user._id });
  res.render("availability", {
    availData,
    user: req.user,
  });
});

//To set availability
router.get(
  "/doctor/setAvailability",
  ensureAuthenticated1,
  async (req, res) => {
    res.render("availability_set", {
      user: req.user,
    });
  }
);

//To update Availability
router.get(
  "/doctor/updateAvailability",
  ensureAuthenticated1,
  async (req, res) => {
    res.render("availability_update", {
      user: req.user,
    });
  }
);

// // appointments handle
// router.post("/doctor/set_availability", async (req, res) => {
//   const { days, startTime, endTime, shift, doctorid } = req.body;
//   let errors = [];

//   //check required fields
//   if (!days || !startTime || !endTime || !shift) {
//     errors.push({ msg: "Please fill in all required fields" });
//   }

//   if (errors.length > 0) {
//     res.render("availability_set", {
//       errors,
//       days,
//       shift,
//       startTime,
//       endTime,
//       doctorid,
//       user: req.user,
//     });
//   } else {
//     const newData = new Availability({
//       shift,
//     });
//     if (req.body.days) {
//       newData.days = Array.isArray(req.body.days)
//         ? req.body.days
//         : [req.body.days];
//     }
//     newData.time.startTime = req.body.startTime;
//     newData.time.endTime = req.body.endTime;
//     newData.doctorid = req.user._id;
//     newData.save();
//     req.flash("success_msg", "Availability data was successfully uploaded");
//     res.redirect("/doctor/availability");
//   }
// });

// router.post("/doctor/update_availability", async (req, res) => {
//   const { days, startTime, endTime, shift, doctorid } = req.body;
//   const result = await Availability.findOneAndUpdate({
//     doctorid: req.user._id,
//   });
//   result.days = req.body.days;
//   result.time.startTime = req.body.startTime;
//   result.time.endTime = req.body.endTime;
//   result.shift = req.body.shift;
//   result.save();
//   req.flash("success_msg", "Availability data was successfully updated");
//   res.redirect("/doctor/availability");
// });

// To handle set availability
router.post("/doctor/set_availability", async (req, res) => {
  const { days, startTime, endTime, shift, doctorid, doctorname } = req.body;
  let errors = [];

  //check required fields
  if (!days || !startTime || !endTime || !shift) {
    errors.push({
      msg: "Please fill in all required fields",
    });
  }

  if (errors.length > 0) {
    res.render("availability_set", {
      errors,
      days,
      startTime,
      endTime,
      shift,
      doctorid,
      doctorname,
      speciality,
      user: req.user,
    });
  } else {
    const newData = new Availability({
      shift,
    });
    if (req.body.days) {
      //If only one value is passed it won't be an array, so you need to create one
      newData.days = Array.isArray(req.body.days)
        ? req.body.days
        : [req.body.days];
    }
    newData.time.startTime = req.body.startTime;
    newData.time.endTime = req.body.endTime;
    newData.doctorid = req.user._id;
    newData.doctorname = req.user.name;
    newData.speciality = req.user.speciality;
    newData.save();
    req.flash("success_msg", "Availability data was successfully uploaded");
    res.redirect("/doctor/availability");
  }
});

//To handle update availability
router.post("/doctor/update_availability", async (req, res) => {
  const { days, startTime, endTime, shift, doctorid, doctorname } = req.body;
  const result = await Availability.findOneAndUpdate({
    doctorid: req.user._id,
  });
  result.days = req.body.days;
  result.time.startTime = req.body.startTime;
  result.time.endTime = req.body.endTime;
  result.shift = req.body.shift;
  result.save();
  req.flash("success_msg", "Availability data was successfully updated");
  res.redirect("/doctor/availability");
});

// View patients
// router.get('/viewpatients',ensureAuthenticated1, async(req, res)=>{
//     const patients = await Patient.find({})
//     res.render('viewpatients',{
//       patients,
//       user:req.user
//     });
// });

// router.get('/viewpatients',ensureAuthenticated1, async(req, res)=>{
//     if(req.query.search) {
//         const regex = new RegExp(escapeRegex(req.query.search),'gi')
//         const patients = await Patient.find({name: regex})
//             if(patients.length<0){
//                 req.flash('error_msg','bhayena yo');
//                 res.redirect('/doctor/viewpatients');
//             }
//             res.render('viewpatients',{
//                 patients,
//                 user:req.user
//             });
//         }
//     else {
//         const patients = await Patient.find({})
//             res.render('viewpatients',{
//                 patients,
//                 user:req.user
//             });
//         }
// });

//To view all patients
router.get("/doctor/viewpatients", ensureAuthenticated1, async (req, res) => {
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
            res.redirect("/doctor/viewpatients");
          } else {
            res.render("viewpatients", {
              patients,
              user: req.user,
              patientCount,
            });
          }
        }
      });
    } else {
      const patients = await Patient.find({});
      res.render("viewpatients", {
        patients,
        user: req.user,
        patientCount,
      });
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//view more details of patients

//patientid
router.param("id", function (req, res, next, _id) {
  Patient.findOne({ _id }, function (err, details) {
    if (err) throw err;
    else {
      req.patient = details;
      next();
    }
  });
});

//particular report
router.param("id", function (req, res, next, patientid) {
  Report.find({ patientid }, function (err, reports) {
    if (err) throw err;
    else {
      req.report = reports;
      next();
    }
  });
});

//particular hospital report
router.param("id", function (req, res, next, patientidadmin) {
  AdminReport.find({ patientidadmin }, function (err, adminreports) {
    if (err) throw err;
    else {
      req.adminreport = adminreports;
      next();
    }
  });
});

//patient details landing page
router.get("/viewpatientsD/:id", ensureAuthenticated1, async (req, res) => {
  res.render("patientdetails", {
    patient: req.patient,
    user: req.user,
  });
});

//patient uploads
router.get(
  "/viewpatientsD/:id/patientUploadsD",
  ensureAuthenticated1,
  async (req, res) => {
    res.render("patientUploads", {
      role: "Doctor",
      images: req.report,
      patient: req.patient,
      user: req.user,
    });
  }
);

//hospital uploads
router.get(
  "/viewpatientsD/:id/hospitalUploadsD",
  ensureAuthenticated1,
  async (req, res) => {
    res.render("hospitalUploads", {
      role: "Doctor",
      adminimages: req.adminreport,
      patient: req.patient,
      user: req.user,
    });
  }
);

module.exports = router;
