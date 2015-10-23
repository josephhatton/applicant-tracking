/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('PositionTemplateCtrl',['$scope','PositionTemplateService','$filter','$routeParams','SessionService',
  function ($scope, PositionTemplateService, $filter, $routeParams, SessionService) {

    $scope.positions = [];
    $scope.error = null;
    $scope.preloader = "show";
    $scope.candidate_count = null;




    PositionTemplateService.lookupPositions().success(function (position_data) {
        console.log(position_data);

        angular.forEach(position_data.groups.Ungrouped, function (position, key) {
          $scope.positions.push({
            pk: position.pk,
            name: position.title,
            type: position.type,
            modified: position.modifiedOn,
            description: position.description,
            status: position.status
          });
        });
        $scope.error = null;
        $scope.preloader = null;
      }).error(function (err) {
        console.log(err);
        $scope.error = "error";
        $scope.preloader = null;
    });
}]);
$(document).ready(function(){
  $('[data-toggle="popover"]').popover();
});
