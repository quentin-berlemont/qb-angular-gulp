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
      img: {
        src: srcPath + 'assets/img/',
        dist: distPath + 'assets/img/'
      },
      css: {
        src: srcPath + 'assets/css/',
        dist: distPath + 'assets/css/'
      },
      js: {
        src: srcPath + 'app/',
        dist: distPath + 'assets/js/'
      },
      template: {
        src: srcPath + 'app/',
        dist: distPath + 'assets/js/'
      },
      spec: {
        src: testPath + 'spec/'
      },
      vendor: {
        css: {
          src: bowerFiles.ext('css').files,
          dist: distPath + 'assets/css/'
        },
        js: {
          src: bowerFiles.ext('js').files,
          dist: distPath + 'assets/js/'
        },
        jsDev: {
          src: bowerFiles.dev().ext('js').files
        }
      }
    }
  };
})();
