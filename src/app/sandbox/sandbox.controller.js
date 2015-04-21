(function() {
  'use strict';

  angular
    .module('app.sandbox')
    .controller('Sandbox', SandboxController);

  /**
   * @ngdoc Controller
   * @memberOf app.sandbox
   * @name Sandbox
   *
   * @description
   * The Sandbox controller.
   *
   * @property {string} greeting - A greeting message
   */
  function SandboxController() {
    var vm = this;

    vm.greeting = 'Hello World!';

    ///////////////
  }
})();
