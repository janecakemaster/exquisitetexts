var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
// var del = require('del');

var jsFiles = [ 'src/js/**/*.js', 'routes/*.js', 'app.js', 'gulpfile.js' ];

gulp.task('sass', function () {
  gulp.src('src/sass/**/*.scss')
  .pipe(g.sassLint())
  .pipe(g.sassLint.format())
  .pipe(g.sass({
    includePaths: require('node-normalize-scss').includePaths
  }))
  .pipe(g.cssnano())
  .pipe(g.rename({
    extname: '.min.css'
  }))
  .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('js', function() {
  gulp.src(jsFiles)
  .pipe(g.jshint({
    lookup: true
  }))
  .pipe(g.jscs({
    fix: true
  }))
  .pipe(g.jshint.reporter(stylish));

  gulp.src('src/js/**/*.js')
  .pipe(g.concat('app.js'))
  .pipe(g.uglify())
  .pipe(g.rename({
      extname: '.min.js'
  }))
  .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('watch', function () {
  gulp.watch('src/sass/*', ['sass']);
  gulp.watch(jsFiles, ['js']);
});

gulp.task('default', ['sass', 'js']);
