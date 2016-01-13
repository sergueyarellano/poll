var express = require('express');
var router = express.Router();
var path = require('path');

/* GET client */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/client/views/index.html'));
});

module.exports = router;