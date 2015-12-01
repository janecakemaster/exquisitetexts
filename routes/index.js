var express = require('express');
var router = express.Router();

var titleBase = 'exquisite texts',
	titleDiv = ' - ';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: titleBase });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: titleBase + titleDiv + 'about' });
});

module.exports = router;
