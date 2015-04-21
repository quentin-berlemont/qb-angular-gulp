(function() {
  'use strict';

  angular
    .module('blocks.exception')
    .factory('exception', exceptionFactory);

  exceptionFactory.$inject = ['logger'];

  /**
   * @ngdoc Service
   * @memberOf blocks.exception
   * @name exception
   *
   * @description
   * The exception service exposes an interface to catch and gracefully handle exceptions.
   *
   * @param {object} logger - {@link blocks.logger.logger The `logger` service}
   */
  function exceptionFactory(logger) {
    var service = {
      catcher: catcher
    };

    return service;

    ////////////////

    /**
     * @method
     * @memberOf blocks.exception.exception
     * @name catcher
     *
     * @description
     * The exception catcher is good for catching and reacting to specific exceptions
     * from calls that you know may throw one. For example, when making an XHR call
     * to retrieve data from a remote web service and you want to catch any exceptions
     * from that service and react uniquely.
     *
     * @param {string} message - An error message
     * @returns {callback}
     */
    function catcher(message) {
      return function(reason) {
        logger.error(message, reason);
      };
    }
  }
})();
