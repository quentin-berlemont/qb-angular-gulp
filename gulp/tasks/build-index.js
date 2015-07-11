(function() {
  'use strict';

  var gulp = require('gulp');
  var plug = require('gulp-load-plugins')();

  var path = require('path');
  var config = require('../config');

  exports.task = function() {
    var sources = [
      config.outputDir + 'vendors.*',
      config.outputDir + 'app.*',
      config.outputDir + 'templates.*',
      config.outputDir + 'translations.*'
    ];

    return gulp.src(path.join(config.sourceDir, 'index.html'))
      .pipe(plug.inject(gulp.src(sources, { read: false }), {
        ignorePath: config.outputDir
      }))
      .pipe(gulp.dest(config.outputDir));
  };
})();
