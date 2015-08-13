angular.module('sample', []);

angular.module('app.directives', []);

angular.module('app.controllers', []);

angular.module('app.services', [])
  .factory('myService', function(){
    function getPublicVar(){
      return "Bang";
    }
    return {
      publicVar: getPublicVar
    };
  });
