const mongoose = require("mongoose");

const StdEnggTool = mongoose.model(
  "StdEnggTool",
  new mongoose.Schema({
    standardCategory: { type: String },
    subCategory: { type: String },
    aeroStandardInd: { type: String },
    spsStandardInd: { type: String },
    hbtStandardInd: { type: String },
    pmtStandardInd: { type: String },
    tool: { type: String },
    aeroIsUsed: { type: String },
    spsIsUsed: { type: String },
    hbtIsUsed: { type: String },
    pmtIsUsed: { type: String },
    "12-Month TCO AutoCalculated": { type: Number }
  })
);

exports.StdEnggTool = StdEnggTool;
