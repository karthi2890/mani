const mongoose = require('mongoose');
const Joi = require('joi');

const Menu = mongoose.model('Menu', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    action: {
        type: String,
    },
    order: {
        type: Number
    },
    subMenu: [{
        title: { type: String },
        action: { type: String },
        order: { type: Number }
    }]
}))

function validateMenu (Menu){
    const objectSchema = Joi.object({
        title: Joi.string(),
        action : Joi.string(),
        order : Joi.number()
    })
    const arraySchema = Joi.array().items(objectSchema)
    const Schema ={
        title : Joi.string().required(),
        action : Joi.string(),
        order : Joi.number(),
        subMenu : Joi.alternatives().try(arraySchema,objectSchema)
    }
    return Joi.validate(Menu,Schema);
}
exports.validate = validateMenu;
exports.Menu = Menu;