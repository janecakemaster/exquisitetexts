var express = require('express');
var router = express.Router();

var titleBase = 'exquisite texts';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about' });
});

module.exports = router;
