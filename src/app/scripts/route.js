/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.config(function ($routeProvider, $httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .when('/jobopenings', {
      templateUrl: 'views/jobopenings.html',
      controller: 'JobOpeningCtrl'
    })
    .when('/candidates/:pk/:status', {
      templateUrl: 'views/candidates.html',
      controller: 'CandidatesCtrl'
    })
    .when('/orderwizard', {
      templateUrl: 'views/orderwizard.html',
      controller: 'CandidatesCtrl' //this needs to be added back.
    })
    .when('/backgroundcheck/:pk', {
      templateUrl: 'views/backgroundcheck.html',
      controller: 'CandidatesCtrl' //this needs to be added back.
    })
    .when('/candidate/:key/:pk/:araPk', {
      templateUrl: 'views/candidate.html',
      controller: 'CandidateCtrl'
    })
    .when('/requisitions', {
      templateUrl: 'views/requisitions.html',
      controller: 'RequisitionCtrl'
    })
    .when('/position-templates', {
      templateUrl: 'views/position-templates.html',
      controller: 'PositionTemplateCtrl'
    })
    .when('/position-assignment', {
      templateUrl: 'views/assign-positions.html',
      controller: 'PositionAssignmentCtrl'
    })
    .otherwise({
      redirectTo: '/dashboard'
    });
});
