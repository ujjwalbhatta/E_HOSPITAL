const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  days: {
    type: Array,
  },
  time: {
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
  },
  shift: {
    type: String,
  },
  doctorid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
  doctorname: {
    type: "String",
  },
  speciality: {
    type: "String",
  },
});

const Availability = mongoose.model("Availability", AvailabilitySchema);

module.exports = Availability;
