/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('LoginCtrl',['$scope','AuthorizationService','$window', '$log','SessionService',
  function ($scope, AuthorizationService, $window, $log, SessionService) {

    $scope.error = null;
    $scope.timedout = null;
    $scope.username = SessionService.getUserName();


    if (SessionService.getTimedOut() !== null &&
        SessionService.getTimedOut() !== 'null') {
      $scope.timedout = SessionService.getTimedOut();
    } else {
      $scope.timedout = null;
    }

    $scope.login = function() {
      AuthorizationService.login($scope.email, $scope.password).success( function(data){
        $scope.error = null;

        AuthorizationService.userDetails($scope.email).success( function(user) {
          SessionService.setUserName(user.data.name);
          SessionService.setUserEmail(user.data.email);
          SessionService.setUserId(user.data.pk);
          SessionService.setUserType(user.data.userType);
          SessionService.setTimedOut(null);
        });

        $window.location.href = "#/jobopenings"
      }).error( function(err){
        $scope.error = "error";
      });
    };

    $scope.forgotPassword = function() {
      AuthorizationService.forgotPassword($scope.email, $scope.token).success( function(data){
        $scope.error = null;

      }).error( function(err){
        $scope.error = "error";
      });
    }

    $scope.logout = function() {
      AuthorizationService.logout().success( function(data){
        $scope.error = null;
        $window.location.href = "#/login"
      }).error( function(err){
        $scope.error = "error";
      });
    }
}]);
