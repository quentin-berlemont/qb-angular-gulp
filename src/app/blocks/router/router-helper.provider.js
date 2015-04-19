(function() {
  'use strict';

  angular
    .module('blocks.router')
    .provider('routerHelper', routerHelperProvider);

  routerHelperProvider.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerHelperProvider($stateProvider, $urlRouterProvider) {
    /* jshint validthis:true */
    var _config = {
      docTitle: '',
      resolveAlways: {}
    };

    this.configure = function(config) {
      angular.extend(_config, config);
    };

    this.$get = routerHelper;

    routerHelper.$inject = ['$rootScope', '$state', '$location', 'logger'];

    function routerHelper($rootScope, $state, $location, logger) {
      var _handlingStateChangeError = false;
      var _hasOtherwise = false;

      var service = {
        addStates: addStates,
        getStates: getStates
      };

      init();

      return service;

      ////////////////

      function init() {
        updateDocTitle();
        handleStateChangeError();
      }

      function updateDocTitle() {
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          _handlingStateChangeError = false;
          var title = _config.docTitle + (toState.title || '');
          $rootScope.title = title;
        });
      }

      function handleStateChangeError() {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
          if (!_handlingStateChangeError) {
            _handlingStateChangeError = true;

            var destination = (toState && (toState.title || toState.name || toState.loadedTemplateUrl))
                            || 'unknown target';
            var msg = 'Error routing to ' + destination + '. '
                    + (error.data || '') + '. <br/>'
                    + (error.statusText || '') + ': ' + (error.status || '');

            logger.warn(msg, [toState]);
            $location.path('/');
          }
        });
      }

      function addStates(states, otherwisePath) {
        states.forEach(function(state) {
          state.config.resolve = angular.extend(state.config.resolve || {}, _config.resolveAlways);
          $stateProvider.state(state.state, state.config);
        });

        if (otherwisePath && !_hasOtherwise) {
          _hasOtherwise = true;
          $urlRouterProvider.otherwise(otherwisePath);
        }
      }

      function getStates() {
        return $state.get();
      }
    }
  }
})();
