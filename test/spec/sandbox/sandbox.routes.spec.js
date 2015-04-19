(function() {
  'use strict';

  describe('app.sandbox.routes', function() {
    var $rootScope;
    var $state;
    var $templateCache;

    beforeEach(module('app.sandbox'));

    beforeEach(inject(function(_$rootScope_, _$state_, _$templateCache_) {
      $rootScope     = _$rootScope_;
      $state         = _$state_;
      $templateCache = _$templateCache_;
    }));

    beforeEach(function() {
      $templateCache.put('app/sandbox/sandbox.html', '');
    });

    describe('app.sandbox.SandboxController', function() {
      it('should map state sandbox to url /sandbox', function() {
        expect($state.href('sandbox', {})).toEqual('/sandbox');
      });

      it('should map /sandbox route to sandbox View template', function () {
        expect($state.get('sandbox').templateUrl).toEqual('app/sandbox/sandbox.html');
      });

      it('of sandbox should work with $state.go', function() {
        $state.go('sandbox');
        $rootScope.$apply();
        expect($state.is('sandbox')).toBe(true);
      });
    });
  });
})();
