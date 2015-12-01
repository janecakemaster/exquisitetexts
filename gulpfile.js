var gulp = require('gulp');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sassLint = require('gulp-sass-lint');

// gulp.task('sass', function () {
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./css'));
// });

gulp.task('sass', function () {
  gulp.src('src/sass/**/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(minifycss())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('public/stylesheets/'));
});


gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('default', function () {
}); 

