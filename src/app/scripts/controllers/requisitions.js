/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('RequisitionCtrl',['$scope','RequisitionService','$filter','$routeParams','SessionService',
  function ($scope, RequisitionService, $filter, $routeParams, SessionService) {

    $scope.requisitions = [];
    $scope.error = null;
    $scope.preloader = "show";
    $scope.candidate_count = null;

    RequisitionService.lookupRequisitions().success(function (requisition_data) {
        console.log(requisition_data);

      $scope.requisitions = requisition_data.data;
        //angular.forEach(requisition_data, function (requisition, key) {
        //  $scope.requisitions.push({
        //    pk: requisition.pk,
        //    name: requisition.requisitionNumber,
        //    position: requisition.requisitionNumber,
        //    department: requisition.department,
        //    location: requisition.location,
        //    recruiter: requisition.phone,
        //    status: requisition.status
        //  })
        //});
        $scope.error = null;
        $scope.preloader = null;
      }).error(function (err) {
        console.log(err);
        $scope.error = "error";
        $scope.preloader = null;
    });
}]);
