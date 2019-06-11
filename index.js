const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/db');  
require('./startup/route')(app);  

const port = process.env.port || 3000;
app.listen(port,'0.0.0.0',()=>winston.info(`Listening on the port: ${port}...`));