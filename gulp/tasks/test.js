(function() {
  'use strict';

  var karma = require('karma').server;
  var path = require('path');
  var constants = require('../constants');
  var ROOT = constants.ROOT;
  var util = require('../utils');
  var args = util.args;

  exports.task = function(done) {
    karma.start({
      configFile: path.join(ROOT, 'karma.conf.js'),
      singleRun: !args.tdd
    }, done);
  };
})();
