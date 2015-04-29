(function() {
  'use strict';

  describe('Sandbox controller', function() {
    var controller;

    beforeEach(module('app.sandbox'));

    beforeEach(inject(function($controller) {
      controller = $controller('Sandbox');
    }));

    it('should say "Hello World!"', function() {
      expect(controller.greeting).toBe('Hello World!');
    });
  });
})();
