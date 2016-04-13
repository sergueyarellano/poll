var express = require('express');
var router = express.Router();
var path = require('path');
var Model = require('../app/models/model');

/* GET client */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../public/client/views/index.html'));
});

module.exports = router;
