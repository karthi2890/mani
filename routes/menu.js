const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const {Menu,validate} = require('../models/menu');

router.get('/', async(req,res) =>{  
    res.send({
        data : await Menu.find()
     });
});

router.post('/', async (req,res) =>{
const {error} = validate(req.body);
if(error) return res.sendStatus(400).send(error.details[0].message);

let menu = new Menu({
    title : req.body.root,
    action : req.body.action,
    order : req.body.order,
    subMenu : req.body.subMenu
});
res.send(await menu.save());
});

module.exports = router;