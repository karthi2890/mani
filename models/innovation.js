const mongoose = require("mongoose");

const Innovation = mongoose.model(
  "Innovation",
  new mongoose.Schema({
    ideaName: { type: String },
    innovators: { type: String },
    portfolio: { type: String },
    month: { type: String },
    remarks: { type: String },
    category: { type: String },
    isConverted: { type: String }
  })
);

exports.Innovation = Innovation;



