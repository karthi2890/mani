const mongoose = require("mongoose");

const EnggChange = mongoose.model(
  "EnggChange",
  new mongoose.Schema({
    Number: { type: String },
    State: { type: String },
    Assignmentgroup: { type: String },
    Businessservice: { type: String },
    Created: { type: Date },
    Urgency: { type: String }
  })
);

exports.EnggChange = EnggChange;
