var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var path = require('path');
var config = require('../config');
var constants = require('../constants');
var IS_DEV = constants.IS_DEV;

exports.dependencies = ['lint-js'];

exports.task = function() {
  return gulp.src([config.sourceDir + 'app/**/*.js', '!' + config.sourceDir + 'app/**/*.spec.js'])
    .pipe(plug.sourcemaps.init())
    .pipe(plug.angularFilesort())
    .pipe(plug.concat('app.js'))
    .pipe(plug.ngAnnotate())
    .pipe(plug.if(!IS_DEV, plug.uglify()))
    .pipe(plug.if(!IS_DEV, plug.rename({ suffix: '.min' })))
    .pipe(plug.sourcemaps.write())
    .pipe(gulp.dest(config.outputDir));
};
