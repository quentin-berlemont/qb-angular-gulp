(function() {
  'use strict';

  var bowerFiles = require('bower-files')();
  var config = require('./gulp/config');

  function listFiles() {
    var files = []
      .concat(bowerFiles.dev().ext('js').files)
      .concat([
        config.sourceDir + 'app/**/*.html',
        config.sourceDir + 'app/**/*.js',
      ]);

    return files;
  }

  function listPreprocessors() {
    var preprocessors = {};

    preprocessors['src/app/**/*.html'] = ['ng-html2js'];
    preprocessors['src/app/**/*.js'] = ['coverage'];

    return preprocessors;
  }

  module.exports = function(karmaConfig) {
    karmaConfig.set({
      files: listFiles(),

      browsers: ['PhantomJS'],

      frameworks: ['jasmine', 'angular-filesort'],

      preprocessors: listPreprocessors(),

      ngHtml2JsPreprocessor: {
        stripPrefix: config.sourceDir,
        moduleName: 'templateCache'
      },

      angularFilesort: {
        whitelist: [
          config.sourceDir + 'app/**/!*.html',
          config.sourceDir + 'app/**/!(*.spec|*.mock).js'
        ]
      },

      reporters: ['progress', 'coverage', 'html'],

      coverageReporter: {
        dir: config.coverageDir,
        reporters: [
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' }
        ]
      }
    });
  };
})();
