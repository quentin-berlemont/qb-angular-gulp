(function() {
  'use strict';

  angular
    .module('app.core')
    .config(configureRouter);

  configureRouter.$inject = ['$locationProvider', 'routerHelperProvider'];

  /**
   * @function
   * @memberOf app.core
   * @name configureRouter
   *
   * @description
   * Configure the router.
   *
   * @param {object} $locationProvider - The angular `$location` provider
   * @param {object} routerHelperProvider - {@link blocks.router.routerHelperProvider The `routerHelper` provider}
   */
  function configureRouter($locationProvider, routerHelperProvider) {
    $locationProvider.html5Mode(true);

    routerHelperProvider.configure({
      docTitle: 'Qb Angular Gulp - '
    });
  }
})();
