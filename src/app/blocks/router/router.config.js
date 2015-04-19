(function() {
  'use strict';

  angular
    .module('blocks.exception')
    .config(routerConfig);

  routerConfig.$inject = ['$locationProvider'];

  function routerConfig($locationProvider) {
    $locationProvider.html5Mode(true);
  }
})();
