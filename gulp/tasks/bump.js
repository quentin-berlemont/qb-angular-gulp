(function() {
  'use strict';

  var gulp = require('gulp');
  var plug = require('gulp-load-plugins')();

  var path = require('path');
  var constants = require('../constants');
  var ROOT = constants.ROOT;
  var util = require('../utils');
  var args = util.args;

  exports.task = function() {
    var options = {};

    if (args.version) {
      options.version = args.version;
    } else {
      options.type = args.type;
    }

    return gulp.src([path.join(ROOT, 'bower.json'), path.join(ROOT, 'package.json')])
      .pipe(plug.bump(options))
      .pipe(gulp.dest(ROOT));
  };
})();
