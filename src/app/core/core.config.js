(function() {
  'use strict';

  angular
    .module('app.core')
    .config(configureRouter)
    .config(configureTranslater);

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
      pageTitle: 'Qb Angular Gulp - '
    });
  }

  configureTranslater.$inject = ['$translateProvider'];

  /**
   * @function
   * @memberOf app.core
   * @name configureTranslater
   *
   * @description
   * Configure the translater.
   *
   * @param {object} $translateProvider - The angular `$translate` provider
   */
  function configureTranslater($translateProvider) {
    $translateProvider.preferredLanguage('fr');
  }
})();
