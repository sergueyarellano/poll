var express = require('express');
var router = express.Router();
var path = require('path');
const ipFilter = require('ip-filter');

/* GET client */
router.get('/', function(req, res, next) {
    var ipArray = req._remoteAddress.split(':')[3].split('.');

    console.log('request',req._remoteAddress.split(':')[3]);
    if (parseInt(ipArray[0]) === 127 && parseInt(ipArray[2]) === 0) {
        res.send({
            message: 'Esta Ip no tiene permitido el acceso',
            ip: req._remoteAddress.split(':')[3]

    });
    } else {

        res.sendFile(path.join(__dirname + '/../public/client/views/index.html'));
    }
});

module.exports = router;
