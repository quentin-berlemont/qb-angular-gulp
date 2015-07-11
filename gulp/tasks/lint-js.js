(function() {
  'use strict';

  var gulp = require('gulp');
  var plug = require('gulp-load-plugins')();

  var config = require('../config');

  exports.task = function() {
    return gulp.src(config.sourceDir + 'app/**/!(*.spec|*.mock).js')
      .pipe(plug.jshint())
      .pipe(plug.jshint.reporter('jshint-stylish'))
      .pipe(plug.jshint.reporter('fail'))
      .pipe(plug.jscs());
  };
})();
