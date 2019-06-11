const mongoose = require("mongoose");

const EnggProblem = mongoose.model(
  "EnggProblem",
  new mongoose.Schema({
    State: { type: String }
  })
);

exports.EnggProblem = EnggProblem;
