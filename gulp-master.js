var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var minimist = require('minimist');

module.exports = function(gulp, bowerPackage) {
  var ELEMENT = bowerPackage.name;
  var VERSION = bowerPackage.version;
  var VULCANIZED = ELEMENT + '.vulcanized.html';
  var VERSIONED_VULCANIZED = ELEMENT + '-' + VERSION + '.vulcanized.html';

  // Copy All Files At The Root Level (app)
  gulp.task('copy', function () {
    var app = gulp.src([
      '*.html',
      '*.js',
      '*.css'
    ], {
      dot: true
    }).pipe(gulp.dest('dist/elements'));

    var bower = gulp.src([
      'bower_components/**/*'
    ]).pipe(gulp.dest('dist'));

    var vulcanized = gulp.src([ELEMENT + '.html'])
      .pipe($.rename(VULCANIZED))
      .pipe(gulp.dest('dist/elements'));
    var vulcanized = gulp.src([ELEMENT + '.html'])
      .pipe($.rename(VERSIONED_VULCANIZED))
      .pipe(gulp.dest('dist/elements'));
  });

  gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

  // Vulcanize imports
  gulp.task('vulcanize', function () {
    return gulp.src('dist/elements/*.vulcanized.html')
      .pipe($.vulcanize({
        stripComments: true,
        inlineCss: true,
        inlineScripts: true,
      }))
      .pipe(gulp.dest('dist/elements'))
      .pipe($.size({title: 'vulcanize'}));
  });

  // Vulcanize imports
  gulp.task('release', function () {
    var vulcanized = gulp.src(['dist/elements/' + VULCANIZED])
      .pipe(gulp.dest('release'));
    var vulcanized = gulp.src(['dist/elements/' + VERSIONED_VULCANIZED])
      .pipe(gulp.dest('release'));
  });

  // Build Production Files, the Default Task
  gulp.task('default', ['clean'], function (cb) {
    runSequence(
      'copy',
      'vulcanize',
      'release',
      cb);
      // Note: add , 'precache' , after 'vulcanize', if your are going to use Service Worker
  });
}