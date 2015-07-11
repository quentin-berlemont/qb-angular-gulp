(function() {
  'use strict';

  var gulp = require('gulp');
  var shell = require('gulp-shell');

  var config = require('../config');

  exports.task = shell.task([
    'jsdoc -c node_modules/angular-jsdoc/conf.json -t node_modules/angular-jsdoc/template -d ' + config.docsDir + ' -r ' + config.sourceDir
  ]);
})();
