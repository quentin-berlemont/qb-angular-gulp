(function() {
  'use strict';

  angular
    .module('blocks.router')
    .provider('routerHelper', routerHelperProvider);

  routerHelperProvider.$inject = ['$stateProvider', '$urlRouterProvider'];

  /**
   * @ngdoc Provider
   * @memberOf blocks.router
   * @name routerHelperProvider
   *
   * @description
   * The `routerHelper` provider.
   *
   * @param {object} $stateProvider - The ui-router `$state` provider
   * @param {object} $urlRouterProvider - The ui-router `$urlRouter` provider
   */
  function routerHelperProvider($stateProvider, $urlRouterProvider) {
    /* jshint validthis:true */
    var _config = {
      docTitle: '',
      resolveAlways: {}
    };

    /**
     * @method
     * @memberOf blocks.router.routerHelperProvider
     * @name configure
     *
     * @description
     * Configure {@link blocks.router.routerHelper the `routerHelper` service}.
     *
     * @param {object} config - The configuration object
     */
    this.configure = function(config) {
      angular.extend(_config, config);
    };

    this.$get = routerHelperFactory;

    routerHelperFactory.$inject = ['$rootScope', '$state', '$location', 'logger'];

    /**
     * @ngdoc Factory
     * @memberOf blocks.router
     * @name routerHelperFactory
     *
     * @description
     * Returns an instance of {@link blocks.router.routerHelper the `routerHelper` service}.
     *
     * @param {object} $rootScope - The angular `$rootScope` service
     * @param {object} $state - The angular `$state` service
     * @param {object} $location - The angular `$location` service
     * @param {object} logger - {@link blocks.logger.logger The `logger` service}
     *
     * @returns {object}
     */
    function routerHelperFactory($rootScope, $state, $location, logger) {
      var _handlingStateChangeError = false;
      var _hasOtherwise = false;

      /**
       * @ngdoc Service
       * @memberOf blocks.router
       * @name routerHelper
       *
       * @description
       * The `routerHelper` service.
       */
      var service = {
        addStates: addStates,
        getStates: getStates
      };

      _init();

      return service;

      ////////////////

      function _init() {
        _updateDocTitle();
        _handleStateChangeError();
      }

      function _updateDocTitle() {
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          _handlingStateChangeError = false;
          var title = _config.docTitle + (toState.title || '');
          $rootScope.title = title;
        });
      }

      function _handleStateChangeError() {
        /**
         * Route cancellation:
         * On routing error, go to '/'.
         * Provide an exit clause if it tries to do it twice.
         */
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

      /**
       * @method
       * @memberOf blocks.router.routerHelper
       * @name addStates
       *
       * @description
       * Add states to the router.
       *
       * @param {array} states - An array of states configuration
       * @param {string} otherwisePath -
       * The route definition that will be used on route change when no other route definition is matched.
       */
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

      /**
       * @method
       * @memberOf blocks.router.routerHelper
       * @name getStates
       *
       * @description
       * Returns the states configuration.
       *
       * @returns {array}
       */
      function getStates() {
        return $state.get();
      }
    }
  }
})();
