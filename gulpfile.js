var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
var del = require('del');

gulp.task('sass', function () {
  gulp.src('src/sass/**/*.scss')
  .pipe(g.sassLint())
  .pipe(g.sassLint.format())
  .pipe(g.sass({
    includePaths: require('node-normalize-scss').includePaths
  }))
  .pipe(g.minifyCss())
  .pipe(g.rename({
    extname: '.min.css'
  }))
  .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('js', function() {
  gulp.src('src/js/**/*.js')
  .pipe(g.jshint({
    lookup: true
  }))
  .pipe(g.jscs({
    fix: true 
  }))
  .pipe(g.jshint.reporter(stylish))
  .pipe(g.concat('app.js'))
  .pipe(g.uglify())
  .pipe(g.rename({
      extname: '.min.js'
  }))
  .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

// gulp.task('clean', function(cb) {
//   del([
//     'public/**/*.min.css', 'public/**/*.min.js'
//   ], cb);
// });

gulp.task('default', ['sass', 'js']);