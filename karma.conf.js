'use strict';

var bowerFiles = require('bower-files')();

function listFiles() {
  var files = []
    .concat(bowerFiles.dev().ext('js').files)
    .concat([
      'src/app/**/*.html',
      'src/app/**/*.js',
    ]);

  return files;
}

module.exports = function(config) {
  config.set({
    files: listFiles(),

    browsers: ['PhantomJS'],

    frameworks: ['jasmine', 'angular-filesort'],

    preprocessors: {
      'src/app/**/*.html': ['ng-html2js'],
      'src/app/**/*.js': ['coverage']
	},

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'templateCache'
    },

	angularFilesort: {
      whitelist: [
        'src/app/**/!(*.html)',
        'src/app/**/!(*.spec|*.mock).js'
      ]
    },

    reporters: ['progress', 'coverage', 'html'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
    }
  });
};
