const mongoose = require("mongoose");

const EnggApplication = mongoose.model(
  "EnggApplication",
  new mongoose.Schema({
    SBG: { type: String },
    SBU: { type: String },
    Organization: { type: String },
    Domain: { type: String },
    BusinessApplicationName: { type: String }
  })
);

exports.EnggApplication = EnggApplication;
