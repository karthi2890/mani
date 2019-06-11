const mongoose = require("mongoose");
const Joi = require("joi");

const WordCloud = mongoose.model(
  "WordCloud",
  new mongoose.Schema({
    type: { type: String },
    word: { type: String },
    frequency: { type: Number }
  })
);

// function validateWordCloud(WordCloud) {
//   const Schema = {
//     word: Joi.string(),
//     frequency: Joi.number()
//   };
//   return Joi.validate(WordCloud, Schema);
// }

exports.WordCloud = WordCloud;
//exports.validate = validateWordCloud;
