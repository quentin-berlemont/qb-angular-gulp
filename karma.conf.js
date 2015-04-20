(function() {
  'use strict';

  var config        = require('./config');
  var coveragePath  = config.path.coverage;
  var preprocessors = {};
  preprocessors[config.path.js.src + '**/*.js'] = 'coverage';

  module.exports = function(config) {
    config.set({
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
      }
    });
  };
})();
