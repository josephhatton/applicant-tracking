'use strict';

angular.module('hiretrueApp')
  .factory('PositionTemplateService',['$http','sharedSvc' ,  function ($http, sharedSvc) {
    // Service logic
    // ...

    var srv = {};

    // Public API here
      srv.lookupPositions = function () {
        var url = "/hiretrue/api/position/list";
        return $http.get(url);
    };

    return srv;
  }]);
