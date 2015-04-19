(function() {
  'use strict';

  describe('app.sandbox.SandboxController', function() {
    var SandboxController;

    beforeEach(module('app.sandbox'));

    beforeEach(inject(function($controller) {
      SandboxController = $controller('SandboxController');
    }));

    it('should say "Hello World!"', function() {
      expect(SandboxController.greeting).toBe('Hello World!');
    });
  });
})();
