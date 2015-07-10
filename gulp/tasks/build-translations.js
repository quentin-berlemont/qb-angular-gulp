var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var path = require('path');
var config = require('../config');
var constants = require('../constants');
var IS_DEV = constants.IS_DEV;

exports.task = function() {
  return gulp.src(config.sourceDir + 'app/**/i18n-*.json')
    .pipe(plug.sourcemaps.init())
    .pipe(plug.angularTranslate('translations.js', {
      module: 'app.core',
      standalone: false
    }))
    .pipe(plug.if(!IS_DEV, plug.uglify()))
    .pipe(plug.if(!IS_DEV, plug.rename({ suffix: '.min' })))
    .pipe(plug.sourcemaps.write())
    .pipe(gulp.dest(config.outputDir));
};
