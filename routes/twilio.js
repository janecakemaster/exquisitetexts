var express = require('express');
var router = express.Router();

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
  res.render('index');
});

module.exports = router;
