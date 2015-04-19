(function() {
  'use strict';

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
