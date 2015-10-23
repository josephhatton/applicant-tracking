/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('AppOVModalCtrl',['$rootScope','$scope','CandidatesService','$filter','$routeParams','SessionService',
  '$sce', '$timeout', 'sharedSvc','pdfDelegate','$modal',
  function ($rootScope, $scope, CandidatesService, $filter, $routeParams, SessionService,$sce,$timeout,sharedSvc, pdfDelegate,
            $modal) {

      $scope.araPk = $routeParams.araPk;
      $scope.pk = $routeParams.pk

    /*
     ******************************  COMMENTS Modal *****************************
     */
    $scope.comments = [];
    $scope.jobTitle = null;
    $scope.forwardDocuments = [];

    $scope.openModalComment = function () {
      var modalInstance = $modal.open({
        templateUrl: 'applicantViewCommentsModel.html',
        controller: 'ApplicantCommentsModalCtrl',
        resolve: {
          comments: function () {
            return $scope.comments;
          },
          pk: function () {
            return $routeParams.pk;
          }
        }
      });
    };

    /*
     ******************************  EMAIL FORWARD Modal *****************************
     */
    $scope.openModalEmailForward = function () {
      var $modalInstance = $modal.open({
        templateUrl: 'emailForwardModal.html',
        controller: 'EmailForwardModalCtrl',
        resolve: {
          forwardDocuments: function () {
            return forwardDocuments();
          },
          pk: function () {
            return $routeParams.pk;
          }
        }
      });
    };

    /*
     ******************************  STATUS HISTORY Modal *****************************
     */
    $scope.openStatusHistory = function (statusHistory) {
      var $modalInstance = $modal.open({
        templateUrl: 'statusHistoryModal.html',
        controller: 'StatusHistoryModalCtrl',
        resolve: {
          statusHistory: function () {
            return  statusHistory;
          }
        }
      });
    };

    //-----------------------------------------------------
    //              CHARTING Modal
    //-----------------------------------------------------
    $scope.openChartsModal = function (kraTraits,weights,xFS,yFS,xProf,yProf) {
      $scope.showloading = true;

      //hack to get the charts to show up in the modal
      $timeout(function() {
          //************************* FIRST STEP TRAITS CHART *****************************
            firstStepGraph('#first-step-chart','','',xFS, yFS);

            //************************* PROFILER SCORE CHART *****************************
            profilerGraph(xProf, yProf);
        }, 3000);

      var $modalInstance = $modal.open({
        templateUrl: 'chartsModal.html',
        controller: 'ChartsModalCtrl',
        resolve: {
          kraTraits: function () {
              return  kraTraits;
            },
          weights: function () {
              return  weights;
            },
          nameTitle: function() {
            return $scope.nameTitle;
          }
        }
      });
    };

    /*******************************************************************
     *
     * @returns {Array|$scope.forwardDocuments|*}
     *
     *****************************************************************/

    function forwardDocuments() {
      $scope.forwardDocuments = [];
      $scope.forwardDocuments.push({
        name: "Questionaires",
        checked: false,
        id: 1
      });
      $scope.forwardDocuments.push({
        name: "Comments",
        checked: false,
        id: 2
      });
      $scope.forwardDocuments.push({
        name: "Background Checks",
        checked: false,
        id: 3
      });
      $scope.forwardDocuments.push({
        name: "Skill Assessments",
        checked: false,
        id: 4
      });
      $scope.forwardDocuments.push({
        name: "Behavioral Assessments",
        checked: false,
        id: 5
      });
      $scope.forwardDocuments.push({
        name: "Positions",
        checked: false,
        id: 6
      });
      $scope.forwardDocuments.push({
        name: "Attachments",
        checked: false,
        id: 7
      });
      $scope.forwardDocuments.push({
        name: "Emails",
        checked: false,
        id: 8
      });
      $scope.forwardDocuments.push({
        name: "Print Wizard",
        checked: false,
        id: 9
      });
      return $scope.forwardDocuments;
    }

    function profilerGraph(x,yy) {
      var y = [{
        y: yy[0]*100,
        color: "#D2433F"
      }, {
        y: yy[1]*100,
        color: "#40B6D8"
      },{
        y: yy[2]*100,
        color: "#4DA74D"
      },{
        y: yy[3]*100,
        color: "#EEA235"
      }];

      $('#profiler-score').highcharts({
        chart: { type: 'column' },
        title: { text: 'Profiler Scores and Weights'  },
        xAxis: {
          categories: x,
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: null
          },
          max:100
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} {point.y:.1f}</td></tr>',
          shared: true,
          useHTML: true
        },
        series: [{
          data: y
        }]
      });
    }
  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

hiretrueApp.controller('ApplicantCommentsModalCtrl',['$scope', '$modalInstance', 'CandidatesService', 'comments', 'pk',
  '$timeout', function ($scope, $modalInstance, CandidatesService, comments, pk,$timeout) {

    $scope.private = true;

    $scope.collapseAddedWarning = true;
    $scope.comments = comments;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.addComment = function(form) {

      CandidatesService.addComment(pk, form.comment, !$scope.private).success(function(success) {
        $scope.collapseAddedWarning = false;
        $timeout(function() {
          $scope.collapseAddedWarning = true;
          $scope.cancel();
        }, 3000);
      }).error(function(err){
        //error
      });
    };
  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
hiretrueApp.controller('EmailForwardModalCtrl',['$scope', '$modalInstance', 'CandidatesService', 'forwardDocuments','pk',
  '$timeout', function ($scope, $modalInstance, CandidatesService, forwardDocuments, pk, $timeout) {


    $scope.forwardDocuments = forwardDocuments;
    $scope.collapseSentWarning = true;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.forward = function(form) {

      CandidatesService.forwardEmail(form.firstName, form.lastName, form.email,form.expires, pk,
        forwardDocuments[0].checked,
        forwardDocuments[1].checked,
        forwardDocuments[2].checked,
        forwardDocuments[3].checked,
        forwardDocuments[4].checked,
        forwardDocuments[5].checked,
        forwardDocuments[6].checked,
        forwardDocuments[7].checked,
        forwardDocuments[8].checked).success(function(success) {
          $scope.collapseSentWarning = false;
          $timeout(function() {
            $scope.collapseSentWarning = true;
            $scope.disabled = 'disabled';
            $scope.cancel();
          }, 3000);
        }).error(function(err){
          //error
          $scope.disabled = '';
        });
    };
  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
hiretrueApp.controller('StatusHistoryModalCtrl',['$scope', '$modalInstance', 'CandidatesService', 'statusHistory',
  '$timeout', function ($scope, $modalInstance, CandidatesService, statusHistory, $timeout) {

    $scope.statusHistory = statusHistory;
    $scope.showloading = false;

    $scope.collapseNoHistoryWarning = true;

    if (statusHistory === null ||
      statusHistory === undefined ||
      statusHistory.length === 0) {
      $scope.collapseNoHistoryWarning = false;
      $scope.showTable = false;
    }


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
hiretrueApp.controller('ChartsModalCtrl',['$scope', '$modalInstance', 'CandidatesService', 'kraTraits', 'weights','nameTitle',
  function ($scope, $modalInstance, CandidatesService, kraTraits, weights, nameTitle) {

    $scope.nameTitle = nameTitle;
    $scope.showloading = false;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.kraTraits = kraTraits;
    $scope.weights = weights;
  }
]);
