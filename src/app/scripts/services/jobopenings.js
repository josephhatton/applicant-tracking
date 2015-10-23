/**
 * Created by Joseph on 2/2/2015.
 */
'use strict';

hiretrueApp
  .factory('JobOpeningService',['$http','sharedSvc' ,  function ($http, sharedSvc) {
    // JobOpeningService logic
    // ...

    var srv = {};

    // Public API here
      srv.jobOpeningList = function (status) {
        var url = "/hiretrue/api/candidate/v2/jobOpeningslist?status="+status;

        return $http.get(url);
    };

    // Public API here
    srv.addComment = function (id,comment) {
      var url = "/hiretrue/api/jobopenings/comment/add";

      var data = {
        requisitionPk: id,
        comment: comment
      };
      return $http.post(url,data);
    };

    // Public API here
    srv.commentList = function (id) {
      var url = "/hiretrue/api/jobopenings/comment/list/"+id;

      var data = {
      };
      return $http.post(url,data);
    };


    // Public API here
    srv.favoritesOn = function (id) {
      var url = "/hiretrue/api/requisition/favorite/set/"+id;

      return $http.get(url);
    };

    // Public API here
    srv.favoritesOff = function (id) {
      var url = "/hiretrue/api/requisition/favorite/reset/"+id;

      return $http.get(url);
    };


    return srv;
  }]);
