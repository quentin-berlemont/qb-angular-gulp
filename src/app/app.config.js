(function() {
  'use strict';

  angular
    .module('app')
    .config(appConfig);

  appConfig.$inject = ['routerHelperProvider'];

  function appConfig(routerHelperProvider) {
    routerHelperProvider.configure({
      docTitle: 'Qb Angular Gulp - '
    });
  }
})();
