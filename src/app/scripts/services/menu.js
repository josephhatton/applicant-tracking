'use strict';

angular.module('hiretrueApp')
  .factory('MenuService',['$http','sharedSvc' ,  function ($http, sharedSvc) {
    // Service logic
    // ...

    var srv = {};

    // Public API here
      srv.lookupWatchList = function () {
        var url = "/hiretrue/api/user/watchlistWithApplicants-list?sortBy=name&sortDirection=ASC&groupBy=UNGROUPED&startFrom=0&itemCount=100";
        return $http.get(url);
    };

    return srv;
  }]);
