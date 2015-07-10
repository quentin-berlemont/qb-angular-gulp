var path = require('path');
var utils = require('./utils');
var args = utils.args;

exports.ROOT = path.normalize(__dirname + '/..');
exports.IS_DEV = args.dev;
