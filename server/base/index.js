// Base routes for default index/root path, about page, 404 error pages, and others..
exports.register = function(server, options, next) {

  server.route([{
    method: 'POST',
    path: '/addline',
    config: {
      handler: function(request, reply) {
        reply.redirect('/');
      }
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

exports.register.attributes = {
  name: 'base'
};