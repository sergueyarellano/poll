var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('welcome', { title: 'BBVA Encuesta Demo PI3' });
});

module.exports = router;
