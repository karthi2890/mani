const mongoose = require("mongoose");
const Joi = require("joi");

const POV = mongoose.model(
  "POV",
  new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    attachment: [
      {
        name: { type: String },
        data: { type: String }
      }
    ]
  })
);
function validatePOV(POV) {
  const objectSchema = {
    name: Joi.string(),
    data: Joi.string()
  };
  const arraySchema = Joi.array().items(objectSchema);
  const Schema = {
    title: Joi.string().required(),
    description: Joi.string(),
    attachment: Joi.alternatives().try(arraySchema, objectSchema)
  };
  return Joi.validate(POV, Schema);
}

exports.POV = POV;
exports.validate = validatePOV;
