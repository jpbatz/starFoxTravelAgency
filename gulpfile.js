var gulp = require('gulp');
var sass = require('gulp-sass');

var path = {
  toSassSrc: './sass/**/*.scss',
  toCssDir: './app/css',
  toCssFiles: './app/css/*.css',
  toHtmlFiles: './app/*.html',
  toPublicDir: __dirname + '/app'
}

gulp.task('styles', function (){
  gulp.src(path.toSassSrc)
    .pipe(sass({
      css: path.toCssDir,
      sass: path.toSassSrc,
      errLogToConsole: true
    }))
    .pipe(gulp.dest(path.toCssDir));
});

gulp.task('watch_styles', function (){
  gulp.watch(path.toSassSrc, ['styles']);
  gulp.watch(path.toHtmlFiles, notifyLiveReload);
  gulp.watch(path.toCssFiles, notifyLiveReload);
});

gulp.task('express', function(){
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(path.toPublicDir));
  app.listen(4000);
});

function notifyLiveReload(event){
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

var tinylr;
gulp.task('livereload', function(){
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

gulp.task('default', ['styles', 'watch_styles', 'express', 'livereload']);