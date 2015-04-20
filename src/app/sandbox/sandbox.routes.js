(function() {
  'use strict';

  angular
    .module('app.sandbox')
    .run(statesConfig);

  statesConfig.$inject = ['routerHelper'];

  function statesConfig(routerHelper) {
    routerHelper.addStates(getStates(), '/sandbox');
  }

  function getStates() {
    return [
      {
        state: 'sandbox',
        config: {
          url: '/sandbox',
          templateUrl: 'app/sandbox/sandbox.html',
          controller: 'Sandbox',
          controllerAs: 'vm',
          title: 'Sandbox'
        }
      }
    ];
  }
})();
