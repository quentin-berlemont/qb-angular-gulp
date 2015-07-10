var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var path = require('path');
var config = require('../config');

exports.task = function() {
  return gulp.src(path.join(config.coverageDir, 'report-lcov/lcov.info'))
    .pipe(plug.coveralls());
};
