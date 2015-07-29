// assets to be used by the 'hapi-assets' module based on process.env.NODE_ENV
module.exports = {
    development: {
        js: ['https://cdn.firebase.com/js/client/2.2.7/firebase.js', 'js/app.js' ],
        css: ['css/style.css']
    },
    production: {
        js: ['js/scripts.js'],
        css: ['css/styles.css']
    }
}