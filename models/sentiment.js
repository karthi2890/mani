const mongoose = require('mongoose');
const Joi = require('joi');

const Sentiment = mongoose.model('Sentiment', new mongoose.Schema({
    customerFeedback :{
        type : String
    },
    createdOn : {
        type : Date
    },
    itProfile : {
        type : String
    }, 
    country : {
        type : String
    },    
    serviceNumber:{
        type : String
    },
    serviceName:{
        type : String
    },
    serviceOwner :{
        type : String
    },
    serviceGroup :{
        type : String
    },
    serviceLeader :{
        type : String
    },
    rating :{
        type : Number
    },
    sentimentType :{
        type : String
    },  
    sentimentScore : {
        type : Number
    },
    problemArea:{
        type : String
    }
   
}))

function validateSentiment(Sentiment){
    const Schema = {
        customerFeedback : Joi.string(),
        createdOn : Joi.date(),
        itProfile : Joi.string(),                      
        country : Joi.string(),      
        serviceNumber : Joi.string(),
        serviceName : Joi.string(),
        serviceOwner : Joi.string(),        
        serviceGroup : Joi.string() ,
        serviceLeader : Joi.string(),
        rating : Joi.number(),
        sentimentType : Joi.string(),
        sentimentScore : Joi.number(),
        problemArea : Joi.string()        
    }
    return Joi.validate(Sentiment,Schema);
}


exports.Sentiment = Sentiment;
exports.validate = validateSentiment;
