const mongoose = require("mongoose");

const EnggChangeApprover = mongoose.model(
  "EnggChangeApprover",
  new mongoose.Schema({
    Number: { type: String },
    State: { type: String },
    Assignmentgroup: { type: String },
    Businessservice: { type: String },
    Created: { type: Date }
  })
);

exports.EnggChangeApprover = EnggChangeApprover;
