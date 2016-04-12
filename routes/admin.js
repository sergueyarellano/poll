var express = require('express');
var router = express.Router();
var path = require('path');

/* GET admin. */
router.get('/', function(req, res, next) {

	if (req.query.user && req.query.user === 'titan') {

  	res.sendFile(path.join(__dirname + '/../public/admin/views/index.html'));
	} else {
  	res.redirect('/welcome/init');
	}
});

module.exports = router;
