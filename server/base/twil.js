var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_AUTH;
var Twilio = require('twilio')(accountSid, authToken);

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
        if (fromTwilio(request)) {
            var resp = new Twilio.TwimlResponse();
            resp.message('this is a reply');
            reply(resp.toString()).type('text/xml');
        }
        else {
            reply.view('404', {
                title: 'bad shit dude'
            }).code(404);
        }
    };
}

function fromTwilio(request) {
    var sig = request.headers['x-twilio-signature'],
        url = process.env.TWILIO_URL + request.url.path,
        body = request.payload || {};

    return Twilio.validateRequest(authToken, sig, url, body);
}

module.exports = twil;