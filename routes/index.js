var Firebase = require('firebase');
var express = require('express');
var router = express.Router();

var titleBase = 'exquisite texts',
poemsRef = new Firebase('https://exquisitehues.firebaseio.com/poems');

router.get('/poem/:id', function(req, res, next) {
  var poemid = req.params.id,
      poemRef = poemsRef.child(poemid);

  poemRef.once('value', function(snapshot) {
    var poem = snapshot.val();

    if (poem && poem.lines) {
      res.render('poem', {
        title: 'poem ' + poemid,
        poemid: poemid,
        poem: poem.lines,
        time: renderDate(new Date(poem.timestamp))
      })
    }
    else {
      next();
    }
  });
});

router.get('/about', function(req, res) {
  res.render('about', { title: 'about' });
});

function renderDate(date) {
    var year = date.getUTCFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = String("00" + date.getHours()).slice(-2),
        minutes = String("00" + date.getMinutes()).slice(-2);
    return month + '/' + day + '/' + year + ' ' + hour + ':' +
        minutes;
}

module.exports = router;
