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

router.get('/poem/:id', function(req, res, next) {
  var poemid = req.params.id,
  poemRef = poemsRef.child(poemid);

  poemRef.once('value', function(snapshot) {
    var poem = snapshot.val();

    if (poem && poem.lines) {
      onRetrieveSuccess(req, res, next, { poem: poem, id: poemid });
    }

    else {
      next();
    }
  });
});

router.get('/about', function(req, res) {
  res.render('about', { title: 'about' });
});

router.get('/', function(req, res) {
  res.render('index');
});

/////////////
// Helpers //
/////////////

function onRetrieveSuccess(req, res, next, data) {
  var prevId = parseInt(data.id, 10) - 1,
  prevRef = poemsRef.child(prevId);

  prevRef.once('value', function(snapshot) {
    var poem = snapshot.val();

    if (poem) {
      data.prevPoemId = prevId;
      checkNext(req, res, next, data);
    }
  });
}

function checkNext(req, res, next, data) {
  var nextId = parseInt(data.id, 10) + 1,
      nextRef = poemsRef.child(nextId);

  nextRef.once('value', function(snapshot) {
    var poem = snapshot.val();

    if (poem) {
      data.nextPoemId = nextId;
      renderPoem(req, res, next, data);
    }
  });
}

function renderPoem(req, res, next, data) {
  res.render('poem', {
    title: 'poem ' + data.id,
    poemid: data.id,
    poem: data.poem.lines,
    time: renderDate(new Date(data.poem.timestamp)),
    prevPoem: data.prevPoemId,
    nextPoem: data.nextPoemId
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
