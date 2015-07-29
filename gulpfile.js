var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

var assets = require('./assets');

gulp.task('build', function(){

    var gulpFileCwd = __dirname +'/public';
    process.chdir(gulpFileCwd);

    // concat and minify your css
    gulp.src(assets.development.css)
        .pipe(concat('styles.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./css/'));

    // concat and minify your js
    gulp.src(assets.development.js)
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js/'));

});


gulp.task('lint', function() {
    return gulp.src([
            'server.js',
            'user-data.js',
            'index.js'
        ])
        .pipe(jshint({
            lookup: true
        }))
        .pipe(jscs({
            fix: true
        }))
        .pipe(jshint.reporter(stylish))
        .pipe(livereload());
});

gulp.task('test', function() {
    return gulp.src('tests/**/*.js')
        .pipe(mocha({
            reporter: 'nyan'
        }));
});

gulp.task('default', ['build']);

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./public/*.html', './public/*.js', './public/*.css'], [
        'build', 'reload'
    ]);
});

gulp.task('reload', function() {
    return livereload.reload();
});