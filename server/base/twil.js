var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_AUTH;
// var client = require('twilio')(accountSid, authToken);
var Twilio = require('twilio');


function twil() {
    this.test = function(request, reply) {
        console.log('somethiong');
        Twilio.messages.create({
                body: request.payload.message,
                to: "+12014463242",
                from: "+17184049006"
            },
            function(err, message) {
                reply(message.sid);
            });
    };

    this.receiveLine = function(request, reply) {
        var resp = new Twilio.TwimlResponse();
        resp.message('this is a reply');
        reply(resp.toString()).type('text/xml');
    };
}

module.exports = twil;