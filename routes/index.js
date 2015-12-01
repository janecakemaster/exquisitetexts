//////////////
// Requires //
//////////////

var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var poemsRef = new Firebase('https://exquisitehues.firebaseio.com/poems');

////////////
// Routes //
////////////

router.get('/poem/:id', getPoem);

router.get('/about', function(req, res) {
  res.render('about', { title: 'about' });
});

router.get('/', function(req, res) {
  res.render('index');
});

/////////////
// Helpers //
/////////////

/**
 * [getPoem description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function getPoem(req, res, next) {
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
}

/**
 * [renderDate description]
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
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
