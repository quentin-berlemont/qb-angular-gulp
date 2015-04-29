(function() {
  'use strict';

  var config       = require('./config');
  var coveragePath = config.path.coverage;

  var files = []
    .concat(config.path.vendors.scriptsDev.src)
    .concat([
      config.path.scripts.src + '**/*.module.js',
      config.path.scripts.src + '**/*.js',
      config.path.specs.src + '**/*.spec.js'
    ]);

  var preprocessors = {};
  preprocessors[config.path.scripts.src + '**/*.js'] = 'coverage';

  module.exports = function(config) {
    config.set({
      files: files,
      browsers: ['PhantomJS'],
      frameworks: ['jasmine'],
      preprocessors: preprocessors,
      reporters: ['progress', 'coverage', 'html'],
      coverageReporter: {
        dir: coveragePath,
        reporters: [
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' }
        ]
      },
      singleRun: true
    });
  };
})();
