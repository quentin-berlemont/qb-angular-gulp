(function() {
  'use strict';

  angular
    .module('app.sandbox')
    .controller('SandboxController', SandboxController);

  function SandboxController() {
    var vm = this;

    vm.greeting = 'Hello World!';

    ///////////////
  }
})();
