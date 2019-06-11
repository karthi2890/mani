//const {WordCloud,validate} = require('../models/wordCloud');
const { WordCloud } = require("../models/wordCloud");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send({
    data: await WordCloud.find()
  });
});

// router.post('/',async(req,res)=>{
//     const {error} = validate(req.body);
//     if(error) return res.sendStatus(400).send(error.details[0].message);

//     let wordCloud = new WordCloud({
//         word : req.body.word,
//         frequency : req.body.frequency
//     })
//     res.send(await wordCloud.save());
// })

module.exports = router;
