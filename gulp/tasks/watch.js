var gulp = require('gulp');

var runSequence = require('run-sequence');
var path = require('path');
var config = require('../config');
var constants = require('../constants');
var ROOT = constants.ROOT;

exports.dependencies = ['build'];

exports.task = function() {
  gulp
    .watch(config.sourceDir + '**/*.{gif,jpg,jpeg,png,svg}', ['build-images'])
    .on('change', logWatch);

  gulp
    .watch(config.sourceDir + 'app/**/*.styl', ['build-styl'])
    .on('change', logWatch);

  gulp
    .watch(config.sourceDir + 'app/**/*.js', function() {
      runSequence('test', 'build-js');
    })
    .on('change', logWatch);

  gulp
    .watch(config.sourceDir + 'app/**/*.html', ['build-templates'])
    .on('change', logWatch);

  gulp
    .watch(config.sourceDir + 'app/**/i18n-*.json', ['build-translations'])
    .on('change', logWatch);

  gulp
    .watch(path.join(ROOT, 'bower.json'), ['build-vendors'])
    .on('change', logWatch);

  gulp
    .watch(path.join(config.sourceDir, 'index.html'), ['build-index'])
    .on('change', logWatch);
};

function logWatch(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}
