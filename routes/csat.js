const {Csat,validate} = require('../models/csat');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async(req,res) =>{ 
    res.send({
        data : await Csat.find()
     });
})


router.post('/',async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.sendStatus(400).send(error.details[0].message);

    let csat = new Csat({
        month : req.body.month,
        year : req.body.year,
        score : req.body.score
    })
    csat = await csat.save();  
    res.send(csat);
})

module.exports = router;