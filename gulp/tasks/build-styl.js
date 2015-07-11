(function() {
  'use strict';

  var gulp = require('gulp');
  var plug = require('gulp-load-plugins')();

  var path = require('path');
  var config = require('../config');
  var constants = require('../constants');
  var IS_DEV = constants.IS_DEV;

  exports.dependencies = ['lint-styl'];

  exports.task = function() {
    return gulp.src(config.sourceDir + 'app/**/*.styl')
      .pipe(plug.sourcemaps.init())
      .pipe(plug.stylus())
      .pipe(plug.concat('app.css'))
      .pipe(plug.autoprefixer())
      .pipe(plug.if(!IS_DEV, plug.minifyCss()))
      .pipe(plug.if(!IS_DEV, plug.rename({ suffix: '.min' })))
      .pipe(plug.sourcemaps.write())
      .pipe(gulp.dest(config.outputDir));
  };
})();
