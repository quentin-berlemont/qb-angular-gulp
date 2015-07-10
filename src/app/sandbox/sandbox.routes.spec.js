(function() {
  'use strict';

  describe('Sandbox routes', function() {
    var $rootScope, $state;

    beforeEach(module('app.sandbox', 'templateCache'));

    beforeEach(inject(function(_$rootScope_, _$state_) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $rootScope = _$rootScope_;
      $state = _$state_;
    }));

    it('should map state sandbox to url /sandbox', function() {
      expect($state.href('sandbox', {})).toEqual('/sandbox');
    });

    it('should map /sandbox route to sandbox view template', function () {
      expect($state.get('sandbox').templateUrl).toEqual('app/sandbox/sandbox.html');
    });

    it('of sandbox should work with $state.go', function() {
      $state.go('sandbox');
      $rootScope.$apply();
      expect($state.is('sandbox')).toBe(true);
    });
  });
})();
