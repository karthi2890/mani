const mongoose = require("mongoose");

const EnggSLA = mongoose.model(
  "EnggSLA",
  new mongoose.Schema({
    Number: { type: Number },
    Application: { type: String },
    Opened: { type: Date },
    State: { type: String },
    Hasbreached: { type: String },
    Actualelapsedpercentage: { type: String },
    Assignmentgroup: { type: String },
    BusinessCriticalIssue: { type: String },
    Assignedto: { type: String }
  })
);

exports.EnggSLA = EnggSLA;
