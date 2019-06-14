// Express
const express = require('express')
const app = module.exports = express();
const cors = require('cors')
const   fs = require("fs"),
      https = require("https");

// CORS
app.use(cors());
app.options('*', cors());

// Configuration
const config = require('./config/config.json')
const port = process.env.PORT || config.port;

let privateKey = fs.readFileSync('sslcert/TheCircleZZM.key').toString();
let certificate = fs.readFileSync('sslcert/TheCircleZZM.crt').toString();

let credentials = {key: privateKey, cert: certificate};

// Utils
require('./utils/startup.util')
require('./utils/database.util')
require('./utils/extension.util')
require('./utils/streaming.util')

// Routing
let routes = require('./routes/routes')
app.use('/api', routes)


var httpsServer = https.createServer(credentials, app);

httpsServer.listen((443), function () {
    console.log('Example app listening on port 443! Go to https://localhost:443/')
  })
  

