(function() {
  'use strict';

  angular
    .module('app.sandbox')
    .controller('Sandbox', Sandbox);

  function Sandbox() {
    var vm = this;

    vm.greeting = 'Hello World!';

    ///////////////
  }
})();
