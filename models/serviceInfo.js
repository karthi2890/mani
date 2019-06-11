const mongoose = require('mongoose');

const ServiceInfo = mongoose.model('ServiceInfo', new mongoose.Schema({
    serviceNumber: { type: String },
    serviceName: { type: String },
    serviceOwner: { type: String },
    serviceGroup: { type: String },
    serviceLeader: { type: String }
}))

exports.ServiceInfo = ServiceInfo;