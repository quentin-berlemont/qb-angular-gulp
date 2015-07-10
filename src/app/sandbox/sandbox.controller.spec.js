(function() {
  'use strict';

  describe('Sandbox controller', function() {
    var controller;

    beforeEach(module('app.sandbox'));

    beforeEach(inject(function($controller) {
      controller = $controller('Sandbox');
    }));
  });
})();
