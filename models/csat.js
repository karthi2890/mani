const mongoose = require('mongoose');
const Joi = require('joi');

const Csat = mongoose.model('Csat', new mongoose.Schema({
    month : {
        type : Number,
        min : 1,
        max : 12     
    },
    year : {
        type : Number
    },
    score :{
        type : Number
    }
}))

function validateCsat(Csat){
    const Schema = {
        month : Joi.number().min(1).max(12),
        year : Joi.number(),
        score : Joi.number().min(0).max(5)
    }
    return Joi.validate(Csat,Schema);
}

exports.Csat = Csat;
exports.validate = validateCsat;