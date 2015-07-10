var del = require('del');
var config = require('../config');

exports.task = function(done) {
  del([config.coverageDir, config.docsDir, config.outputDir], function (err, paths) {
    console.log('Deleted files/folders:\n', paths.join('\n'));
    done(err);
  });
};