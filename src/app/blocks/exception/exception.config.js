(function() {
  'use strict';

  angular
    .module('blocks.exception')
    .config(exceptionConfig);

  exceptionConfig.$inject = ['$provide'];

  function exceptionConfig($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'logger'];

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
