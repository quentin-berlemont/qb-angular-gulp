(function() {
  'use strict';

  var gulp = require('gulp');
  var plug = require('gulp-load-plugins')();

  var path = require('path');
  var config = require('../config');
  var constants = require('../constants');
  var ROOT = constants.ROOT;

  exports.task = function() {
    return gulp.src(config.sourceDir + 'app/**/*.styl')
      .pipe(plug.cached('lint-styl'))
      .pipe(plug.stylint({ config: path.join(ROOT, '.stylintrc') }));
  };
})();
