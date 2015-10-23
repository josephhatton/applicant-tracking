'use strict';

angular.module('hiretrueApp')
  .factory('AuthorizationService',['$http','sharedSvc' ,  function ($http, sharedSvc) {
    // Service logic

    var srv = {};

    srv.login = function (email1,pwd) {
      var url = '/hiretrue/api/login';

      return $http({
        method: 'POST',
        url: url,
        data: $.param({email: email1, password: pwd}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    };


    srv.forgotPassword = function (email,token) {
      var url = '/hiretrue/action/forgot_password/prepare';

      var data = {
        email: email,
        token: token
      };
      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: JSON.stringify(data)
      });
    };

    srv.userDetails = function (email1) {
      var url = '/hiretrue/api/user/details';

      return $http.get(url);
    };

    srv.logout = function () {
      var url = '/hiretrue/api/logout';
      return $http.get(url);
    };

    return srv;
  }]);
