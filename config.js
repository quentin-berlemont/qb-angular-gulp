(function() {
  'use strict';

  var bowerFiles = require('bower-files')();

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
      specs: {
        src: testPath + 'specs/'
      },
      vendors: {
        styles: {
          src: bowerFiles.ext('css').files,
          dist: distPath + 'assets/styles/'
        },
        scripts: {
          src: bowerFiles.ext('js').files,
          dist: distPath + 'assets/scripts/'
        },
        scriptsDev: {
          src: bowerFiles.dev().ext('js').files
        }
      },
      images: {
        src: srcPath + 'assets/images/',
        dist: distPath + 'assets/images/'
      },
      styles: {
        src: srcPath + 'assets/styles/',
        dist: distPath + 'assets/styles/'
      },
      scripts: {
        src: srcPath + 'app/',
        dist: distPath + 'assets/scripts/'
      },
      templates: {
        src: srcPath + 'app/',
        dist: distPath + 'assets/scripts/'
      },
      translations: {
        src: srcPath + 'app/',
        dist: distPath + 'assets/scripts/'
      }
    }
  };
})();
