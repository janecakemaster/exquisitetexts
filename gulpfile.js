var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

gulp.task('css', function() {
    return gulp.src('./public/css/*.css')
        .pipe(concat('app.css'))
        .pipe(minifycss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('js', function() {
    return gulp.src('./public/js/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('./public/js/'));
});


gulp.task('lint', function() {
    return gulp.src([
        './gulpfile.js', './server/**/*.js', './public/js/*.js',
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

gulp.task('default', ['lint', 'js', 'css']);

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./server/**/*.html', './public/js/*.js',
        './public/css/*.css'
    ], [
        'default', 'reload'
    ]);
});

gulp.task('reload', function() {
    return livereload.reload();
});