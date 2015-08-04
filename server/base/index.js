var Firebase = require('firebase'),
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
  console.log('max set to', max);
});

/**
 * When lines get updated, check if a poem needs to get created
 * @param  {DataSnapshot} snapshot
 */

/**
 * When a poem gets added
 * @param  {DataSnapshot} snapshot
 */
poemsRef.on('value', function(snapshot) {
  poem_id = snapshot.numChildren();
  console.log('poem_id:', poem_id);
  // send out the text
});

// linesRef.once('value', function(snapshot) {
//   var lines = snapshot.val();

//   if (snapshot.numChildren() >= max) {
//     var index;
//       poemsRef.once('value', function(snapshot) {
//         index = snapshot.numChildren();
//       });
//     setupCurrentPoem();
//   }
// });

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
      'people': newPoem.people
    });

    currentRef.set({
      'max': generateLimit(),
      'lines': [],
      'people': []
    });

  })
}

function generateLimit() {
  return Math.floor(Math.random() * 18) + 3;
  // return Math.floor(Math.random() * 2) + 2;
}

exports.register.attributes = {
  name: 'base'
};