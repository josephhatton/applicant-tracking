/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('DashboardCtrl',['$log', '$scope','$filter','$routeParams','SessionService','MenuService',
  function ($log, $scope, $filter, $routeParams, SessionService, MenuService) {
    $log.log('DashboardCtrl');


    $scope.watchList = [];
    $scope.candidateList = [];

    MenuService.lookupWatchList().success(function (list_data) {

      angular.forEach(list_data.groups.Ungrouped, function (watchItem, key) {
        $scope.candidateList = [];
        var candidates = watchItem.candidates;
        var keys =  Object.keys(candidates);
        angular.forEach(keys, function (keyVal, key) {
          var candidateName = candidates[keyVal].formattedName;
          $scope.candidateList.push({
            name: candidates[keyVal].formattedName,
            pk: candidates[keyVal].primaryKey})
        });
        $scope.watchList.push({
          id: watchItem.id,
          name: watchItem.name,
          candidates: $scope.candidateList
        });
      });
    });

}]);
