const winston = require('winston');
const mongoose = require('mongoose');

mongoose.connect('mongodb://10.224.76.71:27017/engghub', {useNewUrlParser : true})
            .then(() =>winston.info('Connected to MongoDB...'));