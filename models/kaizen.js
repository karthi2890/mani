const mongoose = require("mongoose");

const Kaizen = mongoose.model(
  "Kaizen",
  new mongoose.Schema({
    employeeName: { type: String },
    name: { type: String },
    reportsTo: { type: String },
    logged: { type: Number },
    implemented: { type: Number },
    date: { type: Date }
  })
);

exports.Kaizen = Kaizen;
