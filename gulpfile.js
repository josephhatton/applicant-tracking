'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var connect = require('gulp-connect');

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'src/app/components',
    exclude: [/bootstrap-sass-official\/.*\.js/, /bootstrap\.css/]
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  if(file==='proxy.js'){
    require('./gulp/' + file)
  }
  else{
    require('./gulp/' + file)(options);
  }
});

gulp.task('serve', function () {
  connect.server({
    root: 'src',
    port: 3000,
    livereload: true,
    middleware: function(connect, o) {
      return [ (function() {
        var url = require('url');
        var proxy = require('proxy-middleware');
        var options = url.parse('http://localhost:8080/hiretrue/api');
       options.route = '/hiretrue/api';
        return proxy(options);
      })() ];
    }
  });
});

var paths = {
  www: ['./src/app/**/*.*'],
  sass: ['./scss/**/*.scss'],
  watch: ['./src/app/**/*.*', './scss/**/*.scss', '!./src/index.html', '!./src/css/**/*']
};

gulp.task('watch', function () {
  gulp.watch(paths.watch, ['reload']);
});

gulp.task('reload', function() {
  gulp
    .src(paths.www)
    .pipe(connect.reload());
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
