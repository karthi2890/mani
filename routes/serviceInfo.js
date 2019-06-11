const { ServiceInfo } = require('../models/serviceInfo');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send({
        data: await ServiceInfo.find().select({serviceOwner:1,serviceGroup:1})        
    });
})

router.post('/', async (req, res) => {
    let data = new ServiceInfo({
        serviceNumber: req.body.serviceNumber,
        serviceName: req.body.serviceName,
        serviceOwner: req.body.serviceOwner,
        serviceGroup: req.body.serviceGroup,
        serviceLeader: req.body.serviceLeader
    });
    res.send(await data.save());
})

module.exports = router;