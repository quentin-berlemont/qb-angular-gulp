var bowerFiles = require('bower-files')();
var config = require('./gulp/config');

var files = []
  .concat(bowerFiles.dev().ext('js').files)
  .concat([config.sourceDir + '/app/**/*.module.js', config.sourceDir + '/app/**/*.js']);
var preprocessors = {};
preprocessors[config.sourceDir + '/app/**/*.js'] = 'coverage';

module.exports = function(config) {
  config.set({
    files: files,
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    preprocessors: preprocessors,
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
