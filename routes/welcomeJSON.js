var express = require('express');
var router = express.Router();
var path = require('path');

/* GET admin. */
router.get('/', function(req, res, next) {
  res.send(JSON.stringify({title:'message',value:'Para conectarte a la votación, accede a /welcome/init'}))
});

module.exports = router;
