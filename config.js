(function() {
  'use strict';

  var bowerFiles  = require('bower-files')();

  var srcPath      = 'src/';
  var distPath     = 'dist/';
  var docsPath     = 'docs/';
  var testPath     = 'test/';
  var coveragePath = 'coverage/';

  module.exports = {
    path: {
      src: srcPath,
      dist: distPath,
      docs: docsPath,
      test: testPath,
      coverage: coveragePath,
      vendor: {
        css: {
          src: bowerFiles.ext('css').files,
          dist: distPath + 'assets/styles/'
        },
        js: {
          src: bowerFiles.ext('js').files,
          dist: distPath + 'assets/scripts/'
        },
        jsDev: {
          src: bowerFiles.dev().ext('js').files
        }
      },
      img: {
        src: srcPath + 'assets/images/',
        dist: distPath + 'assets/images/'
      },
      css: {
        src: srcPath + 'assets/styles/',
        dist: distPath + 'assets/styles/'
      },
      js: {
        src: srcPath + 'app/',
        dist: distPath + 'assets/scripts/'
      },
      spec: {
        src: testPath + 'spec/'
      },
      template: {
        src: srcPath + 'app/',
        dist: distPath + 'assets/scripts/'
      },
      translation: {
        src: srcPath + 'app/',
        dist: distPath + 'assets/scripts/'
      }
    }
  };
})();
