const mongoose = require('mongoose');
const Joi = require('joi');

const StdTool = mongoose.model('StdTool', new mongoose.Schema({
    toolName: {
        type: String,
        required: true
    },
    isStandard: {
        type: String
    },
    stage: [{
        stageName: {
            type: String
        },
        sbg: { 
            type: String 
        },
        sbu: { 
            type: String 
        }
    }],
    category : {
        type : String
    },
    tco: {
        type : Number
    },
    roadmap : {
        type : String
    },
    userbase : {
        type : Number
    }

}))

function validatestdTools(StdTool){
    const objectSchema = Joi.object({
        stageName : Joi.string(),
        sbg : Joi.string(),
        sbu : Joi.string()
    });
    const arraySchema = Joi.array().items(objectSchema)
    const Schema = {
        toolName : Joi.string().required(),
        isStandard : Joi.string(),
        stage : Joi.alternatives().try(arraySchema,objectSchema),
        category : Joi.string(),
        tco : Joi.number(),
        roadmap : Joi.string(),
        userbase : Joi.number()
    };
    return Joi.validate(StdTool,Schema);
}

exports.StdTool = StdTool;
exports.validate = validatestdTools;