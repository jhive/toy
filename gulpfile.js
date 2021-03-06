var gulp = require('gulp');
var exec = require('child_process').exec;
var jshint = require('gulp-jshint');
var karma = require('karma');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var mainBowerFiles = require('main-bower-files');
var clear = require('clear');


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

gulp.task('karma-start', function(){
  exec('node node_modules/.bin/karma start karma.conf.js');
});

gulp.task('karma-run', ['jshint'], function(done){
  karma.runner.run({
      configFile: __dirname + '/karma.conf.js',
  }, done);
});

gulp.task('reload', function(){
  return gulp.src(['src/**/*.js', 'src/**/*.html', 'src/**/*.css'])
    .pipe(connect.reload());
});

//Need to catch errors so mocha doesn't blow up the watcher
gulp.task('watch', ['karma-start'], function(){
  gulp.watch('src/**/*.js', ['clear', 'karma-run', 'reload', 'scripts', 'bower']);
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
