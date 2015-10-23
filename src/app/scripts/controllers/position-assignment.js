/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('PositionAssignmentCtrl',['$scope','JobOpeningService','$filter', '$location', 'SessionService','$window', '$log',
  '$modal', function ($scope, JobOpeningService, $filter, $location, SessionService, $window, $log, $modal) {
    $log.log('PositionAssignmentCtrl');

    $scope.jobList = [];
    $scope.error = null;
    $scope.preloader = "show";
    $scope.archived = false;
    $scope.name = sessionStorage.name;

    //SORTING and FILTERING
    $scope.orderByField = 'name';
    $scope.filterName = 'name';
    $scope.filteredColumn = null;
    $scope.showName = true;

    $scope.toggleFilterName = function(type) {
      $scope.showName = true;
      $scope.localSearch = null;
    }

    $scope.uniqueItem = function(filter){
      $scope.localSearch = $scope.filteredColumn+"&"+ filter;
    }

    $scope.toggleFilterBy = function(type) {
//      $scope.filterName = type;
      $scope.filteredColumn = type;
      $scope.showName = false;
    }

    //TOGGLE FAVORITES
    $scope.toggleStar = function(star, id) {
      if (star.currentTarget.className === 'star') {
        star.currentTarget.className = 'star active';
        JobOpeningService.favoritesOn(id).success(function(data) {
          setFavorites(id,'star active');
        }).error(function(data,err,response, request) {
          star.currentTarget.className = 'star';
          error401 (err);
        });
      } else if (star.currentTarget.className === 'star active') {
        star.currentTarget.className = 'star';
        JobOpeningService.favoritesOff(id).success(function(data) {
          setFavorites(id,'star');
        }).error(function(data,err,response, request) {
          star.currentTarget.className = 'star active';
          error401 (err);
        });
      }
    };

    // toggle selection for a given employee by name
    $scope.toggleAll = function(bool){
      $scope.checkboxes = [];
      if(bool) {
        angular.forEach($scope.candidates, function (candidate, key) {
          position.checked = true;
          $scope.checkboxes.push({'pk':candidate.pk,'araPk':candidate.araPk,'email':candidate.email});
        });
      } else {
        angular.forEach($scope.candidates, function (candidate, key) {
          candidate.checked = false;
        });
      }
    };

    // toggle selection for a given position by name
    $scope.toggleSelection = function(bool, pk, araPk, email){
      if(bool){
        // add item
        $scope.checkboxes.push({'pk':pk,'araPk':araPk,'email':email});
      } else {
        // remove item
        for(var i=0 ; i < $scope.checkboxes.length; i++) {
          if($scope.checkboxes[i].araPk === araPk){
            $scope.checkboxes.splice(i,1);
          }
        }
      }
    };

  function setFavorites(id,favorite) {
      angular.forEach($scope.jobList, function (position, key) {
        if (position.id === id) {
          position.isFavorite = favorite;
        }
      });
    }

    $scope.$watchCollection('jobList', function (newVal, oldVal) {
    });
    getAllJobListing();

    $scope.goToCandidatesURL = function(id, name){
      SessionService.setTitle(name);
      if($scope.archived) {
        $window.location.href = "#/candidates/"+id +"/archived";
      } else {
        $window.location.href = "#/candidates/"+id +"/current";
      }
    };

    $scope.isActive = function (viewLocation) {
      var active = (viewLocation === $location.path());
      var selected = active ? 'dropdown-toggle active' : 'dropdown-toggle';
      return selected;
    };

    $scope.archivedData = function(){
      getAllJobListing();
    };

    function getAllJobListing() {
      if($scope.archived) {
        getJobListing('archived');
      } else {
        getJobListing('current');
      }
    }

    function error401 (err) {
      if (err === 401) {
        sessionStorage.timedOut = "ERROR";
        $window.location.href = "#/login";
      }
    }

    function getJobListing(status){
      $scope.jobList = [];
      $scope.preloader = "show";
      JobOpeningService.jobOpeningList(status).success(function(jobs) {
        angular.forEach(jobs, function (job, key) {
          var isFavorite = null;
          if(job.isFavorite){
            isFavorite = "star active";
          } else {
            isFavorite = "star";
          }
          $scope.jobList.push({
            id: job.requisitionPk,
            name: job.position,
            isFavorite: isFavorite,
            Department: job.department,
            hasComments: job.hasComments,
            noComments: job.hasComments?false:true,
            Location: job.location,
            Type: job.positionTypeDesc,
            count: job.count,
            newCount: job.newCount
          });
        });
        $scope.error = null;
        $scope.preloader = null;
      }).error( function(data,err,response, request){
        $scope.error = "error";
        $scope.preloader = null;
        error401 (err);
      });
    }

    $scope.reset = function() {
      $scope.showName = true;
      $scope.localSearch = null;
      $scope.filterName = null;
      $scope.filteredColumn = null;
    };


}]);
