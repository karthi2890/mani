const mongoose = require("mongoose");
const EnggOperation = mongoose.model(
  "EnggOperation",
  new mongoose.Schema({
    Number: { type: Number },
    Application: { type: String },
    Created: { type: Date },
    CreatedBy: { type: String },
    Description: { type: String },
    ImpactedSBGs: { type: String },
    IncidentState: { type: String },
    Location: { type: String },
    Priority: { type: String },
    Category: { type: String },
    Severity: { type: String },
    ShortDescription: { type: String },
    State: { type: String },
    AssignedTo: { type: String },
    ReassignmentCount: { type: Number },
    ReopenCount: { type: Number },
    BusinessDuration: { type: Number }
  })
);

exports.EnggOperation = EnggOperation;
