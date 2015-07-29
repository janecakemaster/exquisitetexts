// assets to be used by the 'hapi-assets' module based on process.env.NODE_ENV
module.exports = {
    development: {
        js: ['public/js/*.js'],
        css: ['public/css/*.css']
    },
    production: {
        js: ['public/js/app.js'],
        css: ['public/css/style.css']
    }
}