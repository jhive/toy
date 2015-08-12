var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  karma = require('karma'),
  connect = require('gulp-connect'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean'),
  mainBowerFiles = require('main-bower-files'),
  clear = require('clear');


gulp.task('clear', function(){
  clear();
});

gulp.task('clean', function(){
  gulp.src('dist/')
    .pipe(clean());
});

gulp.task('scripts', function(){
  return gulp.src(['src/app/**/*.js', '!src/app/**/*.spec.js'])
    .pipe(concat('scripts/app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('bower', function(){
  return gulp.src(mainBowerFiles(), {base: 'src/vendor/'})
    .pipe(gulp.dest('dist/vendor'));
});

gulp.task('html', function(){
  return gulp.src(['src/**/*.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function(){
  return gulp.src(['src/**/*.js', '!src/vendor/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('karma', function(){
  console.log(__dirname + '/karma.conf.js');

  new karma.Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
    }).start();
});

gulp.task('test', ['jshint'], function(){
   //new karma.Runner().run();
});

gulp.task('reload', function(){
  return gulp.src(['src/**/*.js', 'src/**/*.html', 'src/**/*.css'])
    .pipe(connect.reload());
});

//Need to catch errors so mocha doesn't blow up the watcher
gulp.task('watch', ['karma'], function(){
  gulp.watch('src/**/*.js', ['clear', 'test', 'reload', 'scripts', 'bower']);
  gulp.watch('src/**/*.html', ['clear', 'reload', 'html']);
  gulp.watch('src/**/*.css', ['clear', 'reload']);
});

gulp.task('serve', function(){
  return connect.server({
    root: 'dist',
    livereload: true,
    port: 9000
  })
});

gulp.task('build', ['scripts', 'html', 'bower']);
gulp.task('default', ['build','serve', 'watch']);
