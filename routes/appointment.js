const express = require("express");
const router = express.Router();
const moment = require("moment");

//call models
const Doctor = require("../models/doctor");
const Appointment = require("../models/Appointment");

//Patient uses SideMenu to see appointment
router.get("/myAppointment", async (req, res) => {
  const appointments = await Appointment.find({ patientID: req.user._id });
  res.render("myAppointments", {
    user: req.user,
    appointments,
  });
});

//Patient Uses Appoint Button
router.get("/makeAppointment/:id", async (req, res) => {
  res.render("makeappointment", {
    user: req.user,
  });
  doc_id = req.params.id;
});

//Post method for appointment
router.post("/makeAppointment/:id", async (req, res) => {
  const {
    appointmentDate = "To be confirmed",
    appointmentTime = "To be confirmed",
  } = req.body;
  await Doctor.findOne(
    {
      _id: doc_id,
    },
    async function (err, result) {
      if (err) {
        throw err;
      } else {
        //console.log(result);
        doctorName = result.name;
        doctorSpeciality = result.speciality;
        const appointment = new Appointment({
          appointmentDate,
          appointmentTime,
        });
        appointment.patientID = req.user._id;
        appointment.patientName = req.user.name;
        appointment.doctorID = doc_id;
        appointment.doctorName = doctorName;
        appointment.doctorSpeciality = doctorSpeciality;
        await appointment.save();
        req.flash(
          "success_msg",
          "Appointment successful! We will let you know about the appointment date and time soon.Thank You!"
        );
        //   console.log(appointment);
        res.redirect("/myAppointment");
      }
    }
  );
});

//Admin Sees Appointment
router.get("/seeAppointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.render("seeAppointments", {
    user: req.user,
    appointments,
    moment: moment,
  });
});

//Admin Clicks Update Appointment Button
router.get("/updateAppointment/:id", async (req, res) => {
  res.render("updateAppointment", {
    user: req.user,
  });
  pat_id = req.params.id;
  //console.log(pat_id);
});

//admin updates form to update
router.post("/updateAppointment/:id", async (req, res) => {
  //const { appointmentDate, appointmentTime } = req.body;
  const updateresult = await Appointment.findByIdAndUpdate({
    _id: pat_id,
  });
  updateresult.appointmentDate = req.body.appointmentDate;
  updateresult.appointmentTime = req.body.appointmentTime;
  updateresult.save();
  res.redirect("/seeAppointments");
});

//Patient clicks cancel appointment
router.get("/cancelAppointment/:id", async (req, res) => {
  res.render("cancelAppointment", {
    user: req.user,
  });
  appointment_d_id = req.params.id;
});

//Patient Cancels Appointment
router.post("/cancelAppointment/:id", async (req, res) => {
  const result = await Appointment.findByIdAndDelete({
    _id: appointment_d_id,
  });
  result.deleteOne();
  req.flash("success_msg", "Appointment was cancelled successfully!!");
  res.redirect("/myAppointment");
});

//Admin Deletes Appointment
router.post("/deleteAppointment/:appo_id", async (req, res) => {
  appointment_d_id = req.params.appo_id;
  await Appointment.findOneAndDelete(
    {
      _id: appointment_d_id,
    },
    (err, appointment) => {
      if (err) {
        req.flash("error_msg", "There was an error deleting the appointment");
        res.redirect("/seeApppointments");
      } else {
        req.flash("success_msg", "Apppointment was deleted successfully");
        res.redirect("/seeAppointments");
      }
    }
  );
});

module.exports = router;
