var express = require('express');
var router = express.Router();
var path = require('path');
var Model = require('../app/models/model');
var async = require('async');

const ipFilter = require('ip-filter');

/* GET client */
router.get('/', function(req, res, next) {
    var reqIP = req.headers['x-forwarded-for'] || req._remoteAddress.split(':')[3];
//https://nodejs.org/docs/latest/api/url.html#url_url_format_urlobj
    if (ipFilter(reqIP, ['127.0.0.1']) ||
        ipFilter(reqIP, ['89.107.180.*']) ||
        ipFilter(reqIP, ['89.107.177.*']) ||
        ipFilter(reqIP, ['89.107.183.*'])
        ) {

        // reqIP = req._remoteAddress.split(':')[3];
        console.log('\n[ACCESS GRANTED] %s \n', reqIP);
        res.sendFile(path.join(__dirname + '/../public/client/views/index.html'));

        async.series([

            // check if this ip has voted
            function seriesFindIP(nextSeries) {
                Model.registro.findOne({
                    ip: reqIP
                }).exec(function(err, ip) {

                    nextSeries(null, ip);
                })
            }
        ], function endSeries(err, results) {

            // if not, save the ip and create the registry entry
            if (!results[0]) {

                var registro = new Model.registro();
                registro.ip = reqIP;
                registro.votes.r0 = 0;
                registro.votes.r1 = 0;
                registro.votes.r2 = 0;
                registro.votes.r3 = 0;
                registro.votes.r4 = 0;
                registro.votes.r5 = 0;
                registro.votes.r6 = 0;
                registro.votes.r7 = 0;
                registro.save();
            }
        });
    } else {
        console.log('\n[ACCESS DENIED] %s \n', reqIP);
        res.json({
            denied: 'Invalid NetWork',
            ip: reqIP,
            maybe: 'access via WiFi'
        });
    }
});

module.exports = router;