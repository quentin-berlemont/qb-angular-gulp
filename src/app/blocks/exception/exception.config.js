(function() {
  'use strict';

  angular
    .module('blocks.exception')
    .config(configureExceptionHandler);

  configureExceptionHandler.$inject = ['$provide'];

  /**
   * @function
   * @memberOf blocks.exception
   * @name configureExceptionHandler
   *
   * @description
   * Configure the exception handler.
   *
   * @param {object} $provide - The angular `$provide` service
   */
  function configureExceptionHandler($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'logger'];

  /**
   * @function
   * @memberOf blocks.exception
   * @name extendExceptionHandler
   *
   * @description
   * Decorate the `$exceptionHandler` service to handle uncaught Angular exceptions
   * for development-time or run-time.
   *
   * @param {object} $delegate - The angular `$delegate` service
   * @param {object} logger - {@link blocks.logger.logger The `logger` service}
   *
   * @returns {callback}
   */
  function extendExceptionHandler($delegate, logger) {
    return function(exception, cause) {
      var errorData = {
        exception: exception,
        cause: cause
      };

      logger.error(exception.message, errorData);
      $delegate(exception, cause);
    };
  }
})();
