//////////////
// Requires //
//////////////

var express = require('express');
var router = express.Router();

////////////
// Routes //
////////////

router.get('/about', function(req, res) {
  res.render('about', { title: 'about' });
});

router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
