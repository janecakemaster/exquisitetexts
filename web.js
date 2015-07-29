/* modules */

var Hapi = require('hapi');
var Joi = require('joi');

// var Twilio = require('twilio');
// var Firebase = require('firebase');

// var PoemData = require('./poem-data');
// var poems = PoemData(new Firebase('https://exquisitehues.firebaseio.com/'));

var server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000
});

/* Routes */

// server.route({
//     method: 'POST',
//     path: '/nextline',
//     handler: addLine,
//     config: {
//         validate: {
//             payload: {
//                 line: Joi.string()
//             }
//         }
//     },
// });

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './public',
            index: 'index.html'
    },
});

server.start(function() {
    console.log('yo shit is up at ', server.info.uri);
});


// /* helpers */

// function addLine(req, res) {
//     res().redirect('/');
// }