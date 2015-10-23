'use strict';

angular.module('hiretrueApp')
  .factory('RequisitionService',['$http','sharedSvc' ,  function ($http, sharedSvc) {
    // Service logic
    // ...

    var srv = {};

    // Public API here
      srv.lookupRequisitions = function () {
        var url = "/hiretrue/api/jobBoard/listBoards";
        //http://ec2-54-166-126-13.compute-1.amazonaws.com:8080/hiretrue/api/requisition/list?jobBoardPk=164&groupBy=DEPARTMENT&sortBy=TITLE&sortDirection=DESC&_=1423328094647
        return $http.get(url);
    };

    return srv;
  }]);
