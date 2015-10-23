/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('JobOpeningCtrl',['$scope','JobOpeningService','$filter', '$location', 'SessionService','$window', '$log',
  '$modal', function ($scope, JobOpeningService, $filter, $location, SessionService, $window, $log, $modal) {
    $log.log('JobOpeningCtrl');

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
        SessionService.setTimedOut("ERROR");
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

    /*
     ******************************  COMMENTS Modal *****************************
     */
    $scope.comments = [];
    $scope.jobTitle = null;

    $scope.openModal = function (id,name) {
      $scope.jobTitle = name;
      $scope.comments = [];

      JobOpeningService.commentList(id).success(function(commentData) {

        angular.forEach(commentData.data, function (comment, key) {
          $scope.comments.push({
            comment: comment.comment,
            user: comment.user,
            created: comment.created
          });
        });
        var modalInstance = $modal.open({
          templateUrl: 'commentsModelContent.html',
          controller: 'CommentsModalCtrl',
          resolve: {
            comments: function () {
              return $scope.comments;
            },
            jobTitle: function () {
              return $scope.jobTitle;
            },
            id: function () {
              return id;
            }

          }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () { });

        $scope.error = null;
        $scope.preloader = null;
      }).error( function(data,err,response, request){
        $scope.error = "error";
        $scope.preloader = null;
        error401 (err);
      });
    };
  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

hiretrueApp.controller('CommentsModalCtrl',['$scope', '$modalInstance', 'JobOpeningService', 'comments', 'jobTitle', 'id',
  '$timeout', function ($scope, $modalInstance, JobOpeningService, comments, jobTitle, id,$timeout) {

  $scope.collapseAddedWarning = true;
  $scope.comments = comments;
  $scope.jobTitle = jobTitle;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.addComment = function(form) {
    JobOpeningService.addComment(id, form.comment).success(function(success) {
      $scope.collapseAddedWarning = false;
      $timeout(function() {
        $scope.collapseAddedWarning = true;
      }, 3000);
      $scope.comments = [];
      JobOpeningService.commentList(id).success(function(commentData) {
        angular.forEach(commentData.data, function (comment, key) {
          $scope.comments.push({
            comment: comment.comment,
            user: comment.user,
            created: comment.created
          });
        });
        form.comment = '';
      });
    }).error( function(data,err,response, request){
      $scope.cancel();
      error401 (err);
    });

  };

  $scope.$watchCollection('comments', function (newVal, oldVal) {
  });
}]);
