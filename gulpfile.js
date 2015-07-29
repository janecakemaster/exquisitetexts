var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var livereload = require('gulp-livereload');

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
        .pipe(livereload.reload());
});

gulp.task('test', function() {
    return gulp.src('tests/**/*.js')
        .pipe(mocha({
            reporter: 'nyan'
        }));
});

gulp.task('default', ['lint', 'test']);

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./public/*.html', './public/*.js'], ['reload']);
});

gulp.task('reload', function() {
    return livereload.reload();
});