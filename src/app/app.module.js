(function() {
  'use strict';

  /**
   * @ngdoc Module
   * @name app
   *
   * @description
   * The application module is a manifest of the application's features.
   */
  angular
    .module('app', [
      /* Shared module */
      'app.core',

      /* Feature areas */
      'app.sandbox'
    ]);
})();
