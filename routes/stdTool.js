const {StdTool,validate} = require('../models/stdTool');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if ((req.body.toolName === "" && req.body.sbg === "") || (req.body.toolName === undefined && req.body.sbg === undefined))
        res.send({
            data: await StdTool.find().sort({category : 1})
        });
    else
        res.send({
            data: await StdTool.find()
                .or([{ stage: { $elemMatch: { sbg: { $regex: '.*' + req.body.sbg + '.*', $options: 'i' } } } }, { toolName: { $regex: '.*' + req.body.toolName + '.*', $options: 'i' } }])
                .sort({category : 1})
        });
})

//-----for inserting
router.post('/',async(req,res) =>{
    const {error} = validate(req.body);
    if(error) res.sendStatus(400).send(error.details[0].message);

    let stdtool = new StdTool({
        toolName : req.body.toolName,
        isStandard : req.body.isStandard,
        stage : req.body.stage,
        category : req.body.category,
        tco : req.body.tco,
        roadmap : req.body.roadmap,
        userbase : req.body.userbase
    });
    stdtool = await stdtool.save();
    res.send(stdtool);
})

module.exports = router;