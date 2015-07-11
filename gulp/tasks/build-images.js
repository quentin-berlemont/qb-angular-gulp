(function() {
  'use strict';

  var gulp = require('gulp');
  var plug = require('gulp-load-plugins')();

  var config = require('../config');

  exports.task = function() {
    return gulp.src(config.sourceDir + '**/*.{gif,jpg,jpeg,png,svg}')
      .pipe(plug.imagemin({ optimizationLevel: 4 }))
      .pipe(gulp.dest(config.outputDir));
  };
})();
