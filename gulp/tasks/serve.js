var browserSync = require('browser-sync');
var modRewrite = require('connect-modrewrite');
var config = require('../config');

exports.dependencies = ['watch'];

exports.task = function(done) {
  browserSync({
    server: {
      baseDir: config.outputDir,
      middleware: [
        modRewrite([
          '^[^\\.]*$ /index.html [L]'
        ])
      ]
    }
  }, done);
};
