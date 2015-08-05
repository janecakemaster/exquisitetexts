var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var del = require('del');
var livereload = require('gulp-livereload');

gulp.task('css', function() {
    gulp.src('./public/css/*.css')
        .pipe(concat('app.css'))
        .pipe(minifycss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('js', function() {
    gulp.src('./public/js/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('./public/js/'));
});


gulp.task('lint', function() {
    gulp.src([
        './gulpfile.js', './server/**/*.js', './public/js/*.js',
        '!./public/js/app.min.js'
    ])
        .pipe(jshint({
            lookup: true
        }))
        .pipe(jscs({
            fix: false
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

gulp.task('clean', function(cb) {
    del([
        './public/css/app.min.css', './public/js/app.min.js'
    ], cb);
});

gulp.task('default', ['lint', 'js', 'css']);

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./server/**/*.html', './public/js/*.js',
        './public/css/*.css'
    ], [
        'reload'
    ]);
});

gulp.task('reload', function() {
    return livereload.reload();
});