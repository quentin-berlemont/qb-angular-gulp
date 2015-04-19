(function() {
  'use strict';

  var config = require('./config');

  var preprocessors = {};
  preprocessors[config.path.js.src + '**/*.js'] = 'coverage';

  module.exports = function(config) {
    config.set({
      browsers: ['PhantomJS'],
      frameworks: ['jasmine'],
      preprocessors: preprocessors,
      reporters: ['progress', 'coverage', 'html']
    });
  };
})();
