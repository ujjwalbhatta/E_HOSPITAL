const mongoose = require("mongoose");

const adminreportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title is Required",
  },
  imageUrl: {
    type: String,
  },
  patientidadmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const AdminReports = mongoose.model("Adminreport", adminreportSchema);

module.exports = AdminReports;
