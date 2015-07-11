(function() {
  'use strict';

  var gulp = require('gulp');
  var plug = require('gulp-load-plugins')();

  var mergeStream = require('merge-stream');
  var bowerFiles = require('bower-files')();
  var path = require('path');
  var config = require('../config');
  var constants = require('../constants');
  var IS_DEV = constants.IS_DEV;

  exports.task = function() {
    return mergeStream(
      gulp.src(bowerFiles.ext('css').files)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('vendors.css'))
        .pipe(plug.autoprefixer())
        .pipe(plug.if(!IS_DEV, plug.minifyCss()))
        .pipe(plug.if(!IS_DEV, plug.rename({ suffix: '.min' })))
        .pipe(plug.sourcemaps.write())
        .pipe(gulp.dest(config.outputDir)),
      gulp.src(bowerFiles.ext('js').files)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('vendors.js'))
        .pipe(plug.if(!IS_DEV, plug.uglify()))
        .pipe(plug.if(!IS_DEV, plug.rename({ suffix: '.min' })))
        .pipe(plug.sourcemaps.write())
        .pipe(gulp.dest(config.outputDir))
      );
  };
})();
