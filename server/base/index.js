var Firebase = require('firebase'),
    Twilio = require('twilio'),
    currentRef = new Firebase('https://exquisitehues.firebaseio.com/current'),
    linesRef = currentRef.child('lines'),
    peopleRef = currentRef.child('people'),
    poemsRef = new Firebase('https://exquisitehues.firebaseio.com/poems'),
    max,
    poem_id;

// Base routes for default index/root path, about page, 404 error pages, and others..
exports.register = function(server, options, next) {

    server.route([{
        method: 'POST',
        path: '/addline',
        config: {
            handler: handleLinePost
        }
    }, {
        method: 'POST',
        path: '/test',
        config: {
            handler: handleLinePost
        }
    }, {
        method: 'GET',
        path: '/poem/{id}',
        config: {
            handler: getPoem,
            id: 'poem'
        }
    }, {
        method: 'GET',
        path: '/about',
        config: {
            handler: function(request, reply) {
                reply.view('about', {
                    title: 'Super Informative About Page'
                });
            },
            id: 'about'
        }
    }, {
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply) {
                // Render the view with the custom greeting
                reply.view('index', {
                    title: 'exquisite texts'
                });
            },
            id: 'index'
        }
    }, {
        method: 'GET',
        path: '/{path*}',
        config: {
            handler: function(request, reply) {
                reply.view('404', {
                    title: 'Total Bummer 404 Page'
                }).code(404);
            },
            id: '404'
        }
    }]);

    next();
}

/**
 * When data updates, update the max # of lines
 * @param  {DataSnapshot} snapshot
 */
currentRef.on('value', function(snapshot) {
    var curr = snapshot.val();
    max = curr.max;
});


/**
 * When a poem gets added
 * @param  {DataSnapshot} snapshot
 */
poemsRef.on('value', function(snapshot) {
    poem_id = snapshot.numChildren();
});

/**
 * addline post handler
 * add line and number to current poem
 * then redirect to home
 * @param  {Request} request
 * @param  {Reply} reply
 */
function handleLinePost(request, reply) {
    currentRef.once('value', function(snapshot) {
        var current = snapshot.val(),
            indexRef;

        linesRef = currentRef.child('lines');
        indexRef = linesRef.child(current.lines ? current.lines.length : 0);
        indexRef.set(request.payload.line);
        peopleRef.push(request.payload.phone_number);
    });

    linesRef.once('value', function(snapshot) {
        if (snapshot.numChildren() >= max) {
            createPoem();
        }
    });

    reply.redirect('/');
    // @todo reply with text
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
            'people': newPoem.people,
            'timestamp': Firebase.ServerValue.TIMESTAMP
        });

        currentRef.set({
            'max': generateLimit(),
            'lines': [],
            'people': [],
            'timestamp': ''
        });

    })
}

function generateLimit() {
    return Math.floor(Math.random() * 18) + 3;
    // return Math.floor(Math.random() * 2) + 2;
}

function getPoem(request, reply) {
    var poemRef = poemsRef.child(request.params.id);
    poemRef.once('value', function(snapshot) {
        var poem = snapshot.val();
        
        reply.view('poem', {
            title: 'poem' + request.params.id,
            id: request.params.id,
            poem: poem.lines,
            time: renderDate(new Date(poem.timestamp))
        });
    });
}


function renderDate(date) {
    var year = date.getUTCFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = String("00" + date.getHours()).slice(-2),
        minutes = String("00" + date.getMinutes()).slice(-2);
    return month + '/' + day + '/' + year + ' ' + hour + ':' +
        minutes;
}

exports.register.attributes = {
    name: 'base'
};