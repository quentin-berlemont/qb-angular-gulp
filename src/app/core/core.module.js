(function() {
  'use strict';

  /**
   * @ngdoc Module
   * @name app.core
   *
   * @description
   * The application core module contains all the shared dependencies.
   */
  angular
    .module('app.core', [
      /* Angular modules */
      'ngMaterial',

      /* Cross-app modules */
      'blocks.exception',
      'blocks.logger',
      'blocks.router'

      /* 3rd-party modules */
    ]);
})();
