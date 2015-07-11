(function() {
  'use strict';

  var runSequence = require('run-sequence');

  exports.task = function(done) {
    runSequence(
      ['test'],
      ['build-images', 'build-styl', 'build-js', 'build-templates', 'build-translations', 'build-vendors'],
      ['build-index'],
      done
    );
  };
})();
