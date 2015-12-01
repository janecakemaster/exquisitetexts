var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Firebase = require('firebase');
var Twilio = require('twilio');
var crypto = require('crypto');

var currentRef = new Firebase('https://exquisitehues.firebaseio.com/current'),
    linesRef = currentRef.child('lines'),
    contributorsRef = currentRef.child('contributors'),
    poemsRef = new Firebase('https://exquisitehues.firebaseio.com/poems'),

    client = new Twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_AUTH),

    algorithm = 'aes-256-ctr',
    password = process.env.CRYPTO_PW,

    messages = {
      next: 'what comes next? reply with your next line. ',
      start: 'a blank slate... what\'s the first line of this poem? ',
      last: 'the previous line of the current poem:\n',
      getLast: 'text "LAST" to get the previous line of the current poem. ',
      prompt: 'continue the current poem by replying with the next line. ',
      welcome: 'welcome to exquisite texts. ',
      link: 'here\'s the link to your poem:\n',
      thanks: 'thanks! you\'ll get a link to your poem when it is complete. ',
      wait: 'you\'ve already submitted something, wait until someone else has added a line. '
    },

    max,
    poem_id;

router.post('/', function(req, res, next) {
  if (twilio.validateExpressRequest(req, process.env.TWILIO_AUTH)) {
    var message = req.body.trim().toLowerCase(),
        number = req.payload.From,
        resp = new Twilio.TwimlResponse(),
        respMsg;

    if (message === 'last') {
      var line = getLastLine();

      if (line) {
        respMsg = messages.last + getLastLine() + '\n\n' + messages.next;
      }
      else {
        respMsg = messages.start;
      }
    }
    else if (hasContributed(number) === true) {
      respMsg = messages.wait + messages.getLast;
    }
    // else if (isNew(number) === true) {
    //     respMsg = messages.welcome + messages.getLast + messages.prompt;
    // }
    else {
      addLine(message, number);
      respMsg = messages.thanks;
    }

    resp.message(respMsg);
    response.set('Content-Type', 'text/xml')
    .send(resp.toString());
  }
  else {
    next()
  }
});

function getPoem(req, reply) {
  var poemRef = poemsRef.child(req.params.id);
  poemRef.once('value', function(snapshot) {
    var poem = snapshot.val();

    if (poem && poem.lines) {
      reply.view('poem', {
        title: 'exquisite texts - ' + 'poem' + req.params.id,
        id: req.params.id,
        poem: poem.lines,
        time: renderDate(new Date(poem.timestamp))
      });
    }
    else {
      reply.view('404', {
        title: 'exquisite texts - 404',
        message: 'there is no poem here'
      }).code(404);
    }
  });
}

////////////
// twilio //
////////////

function broadcast(poem, id) {
  for (var encrypted in poem.contributors) {
    var decrypted = decrypt(encrypted),
    message = messages.link + process.env.APP_URL + '/poem/' + id;

    client.sms.messages.create({
      to: decrypted,
      from: process.env.TWILIO_NUMBER,
      body: message
    }, function(error, message) {
      if (!error) {
        poemsRef.child(id + '/contributors/' + encrypted).set(true);
        console.log('success', message);
      }
      else {
        console.log('Oops! There was an error.', error);
      }
    });
  }
  poemsRef.child(id + '/broadcasted').set(true);
}

////////////////////
// firebase logic //
////////////////////

/**
 * Check if person is last person in current poem
 * @param  {[type]} number [description]
 * @return {[type]}        [description]
 */
 function hasContributed(number) {
  var bool;

  currentRef.child('last').once('value', function(snapshot) {
    var last = snapshot.val(),
    encrypted = encrypt(number);
    if (!last) {
      bool = false;
    }
    bool = (last === encrypted);
  });

  return bool;
}

function getLastLine() {
  var line;

  currentRef.once('value', function(snapshot) {
    var curr = snapshot.val();
    if (curr && curr.lines) {
      line = curr.lines.pop();
    }
    else {
      line = null;
    }
  });

  return line;
}

/**
 * Create a new poem
 * @return {[type]} [description]
 */
 function createPoem() {
  currentRef.once('value', function(snapshot) {
    var newPoem = snapshot.val();
    var poemRef = poemsRef.child(poem_id.toString());

    poemRef.set({
      'lines': newPoem.lines,
      'contributors': newPoem.contributors,
      'timestamp': Firebase.ServerValue.TIMESTAMP,
      'broadcasted': false
    });

    currentRef.set({
      'max': generateLimit(),
      'lines': [],
      'contributors': [],
      'timestamp': ''
    });
  });
}

/**
 * add line and number to current poem
 * then redirect to home
 * @param  {Request} req
 * @param  {Reply} reply
 */
 function addLine(line, number) {
  currentRef.once('value', function(snapshot) {
    var current = snapshot.val(),
    encrypted = encrypt(number),
    indexRef;

    // update lines
    linesRef = currentRef.child('lines');
    indexRef = linesRef.child(current.lines ? current.lines.length : 0);
    indexRef.set(line);

    // update contributors
    contributorsRef = currentRef.child('contributors');
    indexRef = contributorsRef.child(encrypted);
    indexRef.set(line);

    // update last person to contribute
    currentRef.child('last').set(encrypted);
  });

  linesRef.once('value', function(snapshot) {
    if (snapshot.numChildren() >= max) {
      createPoem();
    }
  });
}

/////////////
// helpers //
/////////////

// function fromTwilio(req) {
//   var sig = req.headers['x-twilio-signature'],
//   url = process.env.APP_URL + req.url.path,
//   body = req.payload || {};

//   return Twilio.validateRequest(process.env.TWILIO_AUTH, sig, url, body);
// }

function renderDate(date) {
  var year = date.getUTCFullYear(),
  month = date.getMonth() + 1,
  day = date.getDate(),
  hour = String("00" + date.getHours()).slice(-2),
  minutes = String("00" + date.getMinutes()).slice(-2);
  return month + '/' + day + '/' + year + ' ' + hour + ':' +
  minutes;
}

/**
 * Generate the limit for a new poem
 *
 * formula: (Math.random * (max - min)) + min
 * @return {number} integer from min to max
 */
 function generateLimit() {
  return Math.floor(Math.random() * 7) + 3;
  // return Math.floor(Math.random() * 2) + 2;
}

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}


module.exports = router;
