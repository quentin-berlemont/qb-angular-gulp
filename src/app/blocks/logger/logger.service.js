(function() {
  'use strict';

  angular
    .module('blocks.logger')
    .factory('logger', logger);

  logger.$inject = ['$log'];

  function logger($log) {
    var service = {
      log: log,
      info: info,
      warn: warn,
      error: error,
      debug: debug
    };

    return service;

    ////////////////

    function log(message, data) {
      $log.log(message, data);
    }

    function info(message, data) {
      $log.info('Info: ' + message, data);
    }

    function warn(message, data) {
      $log.warn('Warning: ' + message, data);
    }

    function error(message, data) {
      $log.error('Error: ' + message, data);
    }

    function debug(message, data) {
      $log.debug('Debug: ' + message, data);
    }
  }
})();
