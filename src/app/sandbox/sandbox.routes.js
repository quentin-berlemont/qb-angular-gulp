(function() {
  'use strict';

  angular
    .module('app.sandbox')
    .run(configureStates);

  configureStates.$inject = ['routerHelper'];

  /**
   * @function
   * @memberOf app.sandbox
   * @name configureStates
   *
   * @description
   * Configure the sandbox states.
   *
   * @param {object} routerHelper - {@link blocks.router.routerHelper The `routerHelper` service}
   */
  function configureStates(routerHelper) {
    routerHelper.addStates(_getStates(), '/sandbox');
  }

  function _getStates() {
    return [
      {
        state: 'sandbox',
        config: {
          url: '/sandbox',
          templateUrl: 'app/sandbox/sandbox.html',
          controller: 'Sandbox',
          controllerAs: 'vm',
          data: {
            pageTitle: 'Sandbox'
          }
        }
      }
    ];
  }
})();
