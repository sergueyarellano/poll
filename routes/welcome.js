var express = require('express');
var router = express.Router();
var path = require('path');
const ipFilter = require('ip-filter');

/* GET client */
router.get('/', function(req, res, next) {
    var reqIP = req._remoteAddress.split(':')[3];

    ipFilter(reqIP, ['127.0.0.1']) ||
    ipFilter(reqIP, ['89.107.180.*']) || 
    ipFilter(reqIP, ['89.107.177.*']) || 
    ipFilter(reqIP, ['89.107.183.*']) ?
        console.log('\n[ACCESS GRANTED] %s \n', reqIP) ||
        res.sendFile(path.join(__dirname + '/../public/client/views/index.html')) :
        console.log('\n[ACCESS DENIED] %s \n', reqIP) ||
        res.json({denied: 'Invalid NetWork',ip: reqIP, maybe: 'access via WiFi'});
});

module.exports = router;
