/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('CandidateCtrl',['$log', '$scope','CandidatesService','$filter','$routeParams','SessionService',
  'sharedSvc','$modal', '$window',
  function ($log, $scope, CandidatesService, $filter, $routeParams, SessionService, sharedSvc, $modal, $window) {
    $log.log('CandidateCtrl');

    $scope.applicant = {};
    $scope.emails = [];
    $scope.questionnaireList = [];
    $scope.comments = [];
    $scope.candidate = {};
    $scope.positions = [];
    $scope.attachments = [];
    $scope.externalForwardList = [];

    $scope.showLoading = true;
    $scope.noEmail = false;
    $scope.noAttachments = false;
    $scope.noForwarding = false;
    $scope.currentStatuses = [];
    $scope.archivedStatuses = [];
    $scope.kraTraits = [];

    $scope.applicantFlag = {};

    $scope.applicantPk = $routeParams.pk;
    $scope.araPk = $routeParams.araPk;
    $scope.key = $routeParams.key;
    $scope.candidates = JSON.parse(SessionService.getCandidates());
    $scope.positionTitle = SessionService.getTitle();

    getPositions();
    getComments();

    //TOGGLE FAVORITES
     $scope.toggleStar = function(star) {
      if (star.currentTarget.className === 'star') {
        star.currentTarget.className = 'star active';
        CandidatesService.favoritesOn($routeParams.pk).success(function(data) {
        }).error( function(data,err,response, request){
          star.currentTarget.className = 'star';
          error401 (err);
        });
      } else if (star.srcElement.className === 'star active') {
        star.currentTarget.className = 'star';
        CandidatesService.favoritesOff($routeParams.pk).success(function(data) {
        }).error( function(data,err,response, request){
          star.currentTarget.className = 'star active';
          error401 (err);
        });
      }
    };

    $scope.enableEditing = function(bool) {
      if (bool) {
        CandidatesService.editEnabled([{araPk: $routeParams.araPk}]).success(function (data) {
        }).error(function(){
          $scope.error = "ERROR"
          $scope.showLoading = false;
          error401 (err);
        });
      } else {
        CandidatesService.editDisabled([{araPk: $routeParams.araPk}]).success(function (data) {
        }).error( function(data,err,response, request){
          $scope.error = "ERROR";
          $scope.showLoading = false;
          error401 (err);
        });
      }
    };

    $scope.updateApplicant = function(applicant) {
      CandidatesService.updateApplicant(applicant).success(function (data) {
        //console.log('Great Success!');
      }).error( function(data,err,response, request){
          $scope.error = "ERROR";
          $scope.showLoading = false;
      });
    };

    $scope.updateComment = function(comment, commentPk,privateBoolean) {
      CandidatesService.updateComment(commentPk,comment, !privateBoolean).success(function (data) {
        getComments();
      }).error( function(data,err,response, request){
        $scope.error = "ERROR";
        $scope.showLoading = false;
        error401 (err);
      });
    };

    $scope.deleteComment = function(commentPk) {
      CandidatesService.deleteComment(commentPk).success(function (data) {
        getComments();
      }).error( function(data,err,response, request){
        $scope.error = "ERROR";
        $scope.showLoading = false;
        error401 (err);
      });
    };

    $scope.changeStatus = function(statusId) {
      CandidatesService.changeStatuses(statusId,[$routeParams.araPk]).success(function (data) {
        getPositions();
      }).error( function(data,err,response, request){
        $scope.error = "ERROR";
        $scope.showLoading = false;
        error401 (err);
      });
    };

    //PREVIOUS-NEXT  BREADCRUMBS

    var url = "";
    if ($scope.candidates) {
        $scope.applicantCount = $scope.candidates.length;
    } else {
        $scope.applicantCount = 0;
    }

      angular.forEach($scope.candidates, function (candidate) {
          if( parseInt($scope.key) === candidate.key) {
              addFlags(candidate);
          }
      });


    $scope.previousApplicant = function(key) {
      var inc = parseInt(key);
      if (inc <=  1 ) {
        $scope.key = $scope.applicantCount;
      } else {
        $scope.key = parseInt(key) - 1;
      }
      angular.forEach($scope.candidates, function (candidate) {
        if (candidate.key === $scope.key) {
          url = "#/candidate/"+$scope.key+"/"+candidate.pk+"/"+candidate.araPk;
          addFlags(candidate);

        }
      });
      $window.location.href = url;
    };

    $scope.nextApplicant = function(key) {
      var inc = parseInt(key);
        if (inc >=  $scope.applicantCount ) {
            $scope.key = 1;
          } else {
            $scope.key = parseInt(key) +1;
          }
      angular.forEach($scope.candidates, function (candidate, count) {
          if (candidate.key === $scope.key) {
            url = "#/candidate/"+$scope.key+"/"+candidate.pk+"/"+candidate.araPk;
            addFlags(candidate);
          }
      });
      $window.location.href = url;
    };

    $scope.$watchCollection('applicantFlag', function (newVal, oldVal) {
    });
    $scope.$watchCollection('positions', function (newVal, oldVal) {
    });

    $scope.$watchCollection('comments', function (newVal, oldVal) {
    });

    $scope.$watch('key', function (newVal, oldVal) {
    });

    $scope.togglePublic = function(toggle,pk) {
      if (toggle) {
        CandidatesService.publicOn(pk).success(function (data) {
        }).error( function(data,err,response, request){
          $scope.error = "ERROR"
          $scope.showLoading = false;
          error401 (err);
        });
      } else {
        CandidatesService.publicOff(pk).success(function (data) {
        }).error( function(data,err,response, request){
          $scope.error = "ERROR"
          $scope.showLoading = false;
          error401 (err);
        });
      }
    }

    sharedSvc.applicantInfo($routeParams.pk,$routeParams.araPk).success(function (info) {
      $scope.noEmail = "";
      //APPLICANT
      //THIS IS NOT ACCEPTABLE BECAUSE THERE ARE TOO MUCH
      //DATA TO CARRY AROUND.  WE JUST NEED THE BASIC APPLICANT INFO
      //$scope.applicant = info.applicant;
      $scope.applicant = {
        key: info.applicant.applicantPk,
        //name: info.applicant.name,
        phone: info.applicant.phone,
        phone2: '',
        email: info.applicant.email,
        loginKey: info.applicant.loginKey,
        address1: {
          primaryKey:info.applicant.address1.primaryKey,
          addressLine1:info.applicant.address1.addressLine,
          addressLine2:info.applicant.address1.addressLine2,
          city: info.applicant.address1.municipality,
          state: info.applicant.address1.region,
          postalCode: info.applicant.address1.postalCode},
        name: {
          primaryKey: info.applicant._name.primaryKey,
          legalName: info.applicant._name.legalName,
          givenName: info.applicant._name.givenName,
          familyName: info.applicant._name.familyName,
          middleName: info.applicant._name.middleName,
          formattedName: info.applicant._name.formattedName,
          lastFirstName: info.applicant._name.lastFirstName,
          informalName: info.applicant._name.informalName,
          displayName: info.applicant._name.displayName,
          preferredGivenName: info.applicant._name.preferredGivenName,
          familyNamePrefix: info.applicant._name.familyNamePrefix,
          sortableName: info.applicant._name.sortableName,
          affixType: info.applicant._name.affixType,
          affix: info.applicant._name.affix
        }
     // formattedName: "Lauren D. Christian"

      };


      $scope.nameTitle = info.applicant.name;
      SessionService.setApplicant($scope.applicant);

      //EMAILS
      if (info.applicant.emails.length === 0) {
        $scope.noEmail = true;
      } else {
        angular.forEach(info.applicant.emails, function(email,key){
          $scope.emails.push({
            date: email.createdTimestamp,
            subject: email.subject,
            status: email.status,
            from: email.fromAddress,
            body: email.body,
            toggle: "isCollapsed"+key
          });
        });
      }

      // EXTERNAL EMAIL FORWARD
      if (info.externalApplicantRoutes.length === 0) {
        $scope.noForwarding = true;
      } else {
        angular.forEach(info.externalApplicantRoutes, function(external,key){
          $scope.externalForwardList.push({
            email: external.email,
            name: external.firstName + " " + external.lastName,
            date: external.createdTimestamp,
            expires: external.expiresAfter
          });
        });
      }

      //QUESTIONNAIRES LIST
      angular.forEach(info.questionnaireListItems, function(questionnaire,key){
          $scope.questionnaireList.push({
            name: questionnaire.name,
            date: questionnaire.dateCreated,
            version: questionnaire.version
          });
      });

      //ATTACHMENT LIST
      angular.forEach(info.applicant.attachments, function(attachment,key){
        var icon = null;
        if (attachment.attachmentType === 'resume') {
          icon = "docx";
        }
        $scope.attachments.push({
          name: attachment.name,
          attachType: attachment.attachmentType,
          type: attachment.type,
          icon: icon,
          pk: attachment.pk
        });
      });

      //STATUSES
      angular.forEach(info.applicant.availableStatuses.activeStatuses, function (status, key) {
        $scope.currentStatuses.push({
          id: status.key,
          name: status.label
        });
      });
      angular.forEach(info.applicant.availableStatuses.archivedStatuses, function (status, key) {
        $scope.archivedStatuses.push({
          id: status.key,
          name: status.label
        });
      });
      $scope.showLoading = false;
    });

    //-----------------------------------------------------
    $scope.users = [
      {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
      {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
      {id: 3, name: 'awesome user3', status: 2, group: null}
    ];

    $scope.statuses = [
      {value: 1, text: 'status1'},
      {value: 2, text: 'status2'},
      {value: 3, text: 'status3'},
      {value: 4, text: 'status4'}
    ];

    $scope.showStatus = function(user) {
      var selected = [];
      if(user.status) {
        selected = $filter('filter')($scope.statuses, {value: user.status});
      }
      return selected.length ? selected[0].text : 'Not set';
    };

    $scope.checkName = function(data, id) {
      if (id === 2 && data !== 'awesome') {
        return "Username 2 should be `awesome`";
      }
    };

    $scope.saveUser = function(data, id) {
      //$scope.user not updated yet
      angular.extend(data, {id: id});
      return $http.post('/saveUser', data);
    };

    // remove user
    $scope.removeUser = function(index) {
      $scope.users.splice(index, 1);
    };

    // add user
    $scope.addUser = function() {
      $scope.inserted = {
        id: $scope.users.length+1,
        name: '',
        status: null,
        group: null
      };
      $scope.users.push($scope.inserted);
    };

    //-----------------------------------------------------
    //              Interview Guide
    //-----------------------------------------------------
    $scope.interviewguide = [];
    $scope.toggleInterviewGuideModal = function( ) {

      CandidatesService.interviewGuide( $routeParams.araPk).success(function (guide) {
        //console.log(guide);
        $scope.interviewguide = [];
        var assertiveness = [];
        var empathy = [];
        var confidence = [];
        var sociability = [];
        var helpfulness = [];
        var thoroughness = [];
        var problemSolving = [];

        angular.forEach(guide.data.Assertiveness, function (assertive, key) {
          assertiveness.push({
            sequence: assertive.sequence,
            question: assertive.question
          });
        });
        angular.forEach(guide.data.Empathy, function (emp, key) {
          empathy.push({
            sequence: emp.sequence,
            question: emp.question
          });
        });
        angular.forEach(guide.data.Confidence, function (conf, key) {
          confidence.push({
            sequence: conf.sequence,
            question: conf.question
          });
        });
        angular.forEach(guide.data.Sociability, function (social, key) {
          sociability.push({
            sequence: social.sequence,
            question: social.question
          });
        });
        angular.forEach(guide.data.Helpfulness, function (helpful, key) {
          helpfulness.push({
            sequence: helpful.sequence,
            question: helpful.question
          });
        });
        angular.forEach(guide.data.Thoroughness, function (thorough, key) {
          thoroughness.push({
            sequence: thorough.sequence,
            question: thorough.question
          });
        });
        angular.forEach(guide.data['Problem Solving'], function (problemSolve, key) {
          problemSolving.push({
            sequence: problemSolve.sequence,
            question: problemSolve.question
          });
        });

        $scope.interviewguide.push({
          name: 'Assertiveness',
          guide: assertiveness
        });
        $scope.interviewguide.push({
          name: 'Empathy',
          guide: empathy
        });
        $scope.interviewguide.push({
          name: 'Confidence',
          guide: confidence
        });
        $scope.interviewguide.push({
          name: 'Sociability',
          guide: sociability
        });
        $scope.interviewguide.push({
          name: 'Helpfulness',
          guide: helpfulness
        });
        $scope.interviewguide.push({
          name: 'Thoroughness',
          guide: thoroughness
        });
        $scope.interviewguide.push({
          name: 'Problem Solving',
          guide: problemSolving
        });

        CandidatesService.chartsInfo($routeParams.araPk).success(function (araInfo) {
          //console.log(araInfo);
          if (araInfo.length === 0) {
            $scope.noCharts = "No Charts Data";
          }
          $scope.kraTraits = [];

          //************************* FIRST STEP TRAITS CHART *****************************
          var xAxis = araInfo.scoreCharts.firstStepTraits.categories;
          var yAxis = araInfo.scoreCharts.firstStepTraits.series[0].data;
          firstStepGraph('#interview-guide',araInfo.department,araInfo.positionTitle,xAxis, yAxis);

          $scope.showLoading = false;
        }).error(function(data){
          $scope.error = "ERROR"
          $scope.showLoading = false;
        });
      }).error(function(err){
        //error
        $scope.showLoading = false;
      });
    };

    //-----------------------------------------------------
    //               First Steps Modal
    //-----------------------------------------------------
    $scope.toggleFirstStepsModal = function() {

      CandidatesService.firstStep($routeParams.araPk).success(function (data) {
        $scope.firstStep  = {
          assertiveness: data.data.traitParagraphMap.A,
          empathy: data.data.traitParagraphMap.EMP1,
          confidence: data.data.traitParagraphMap.CONF,
          sociability: data.data.traitParagraphMap.O,
          helpfulness: data.data.traitParagraphMap.P,
          thoroughness: data.data.traitParagraphMap.R,
          problemSolving: data.data.traitParagraphMap.RR1
        }

        CandidatesService.chartsInfo($routeParams.araPk).success(function (araInfo) {
          if (araInfo.length === 0) {
            $scope.noCharts = "No Charts Data";
          }
          $scope.kraTraits = [];

          //************************* FIRST STEP TRAITS CHART *****************************
          var xAxis = araInfo.scoreCharts.firstStepTraits.categories;
          var yAxis = araInfo.scoreCharts.firstStepTraits.series[0].data;
          firstStepGraph('#first-step',araInfo.department,araInfo.positionTitle,xAxis, yAxis);
          $scope.showLoading = false;
        }).error(function(data){
          $scope.error = "ERROR"
          $scope.showLoading = false;
        });
        $scope.showLoading = false;
      }).error(function(){
        $scope.error = "ERROR"
        $scope.showLoading = false;
      });
    };


    /*
     *****************  FUNCTION CALLS ************************
     */

    function firstStepGraph(chartId,department,position,x,yy) {
      var y = [{
        y: yy[0],
        color: "teal"
      }, {
        y: yy[1],
        color: "#0000FF"
      },{
        y: yy[2],
        color: "#FF0000"
      },{
        y: yy[3],
        color: "purple"
      },{
        y: yy[4],
        color: "green"
      },{
        y: yy[5],
        color: "yellow"
      },{
        y: yy[6],
        color: "orange"
      }];

      $(chartId).highcharts({
        chart: {type: 'column' },
        title: { text: 'FirstStep Personality Traits' },
        xAxis: {
          categories: x
        },
        yAxis: {
          title: {
            text: null
          },
          tickInterval:10,
          max: 100
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

    function error401 (err) {
      if (err === 401) {
        SessionService.setTimedOut("ERROR");
        $window.location.href = "#/login";
      }
    }

    function addFlags(candidate) {
        $scope.applicantFlag = {
            multiJobFlag: candidate.multiJobFlag,
            backgroundCheckFlag: candidate.backgroundCheckFlag,
            skillsAssessmentFlag: candidate.skillsAssessmentFlag,
            editEnabledFlag: candidate.editEnabledFlag,
            remarksFlag: candidate.remarksFlag
        };
    }
    function getComments() {
      $scope.comments = [];
      CandidatesService.commentList($routeParams.pk).success(function (info) {
        //COMMENTS
        angular.forEach(info.data, function(comment,key){
          $scope.comments.push({
            comment: comment.comment,
            date: comment.created,
            private: !comment.publicComment,
            applicantPk: comment.applicantPk,
            user: comment.user,
            pk: comment.pk
          });
        });
      }).error( function(data,err,response, request){
        error401 (err);
      });
    }

    function getPositions() {
      $scope.positions = [];
      CandidatesService.applicantPositionList($routeParams.pk).success(function (info) {
        //POSITION SECTION
        angular.forEach(info, function (position, key) {
          $scope.kraTraits = [];
          $scope.weights = [];

          //************************* FIRST STEP TRAITS CHART *****************************
          var xFS = position.scoreCharts.firstStepTraits.categories;
          var yFS = position.scoreCharts.firstStepTraits.series[0].data;
          //          firstStepGraph('#first-step-chart',position.department,position.positionTitle,xFS, yFS);

          //************************* PROFILER SCORE CHART *****************************
          var xProf = position.scoreCharts.profilerScores.categories;
          if (position.scoreCharts.profilerScores.series.length === 0) {
            return;
          }
          var yProf = position.scoreCharts.profilerScores.series[0].data;
          //          profilerGraph(position.department,position.positionTitle,xProf, yProf);

          //************************* PROFILER WEIGHTS CHART *****************************
            var z = position.scoreCharts.profilerWeights;
            var zzAxis = [z.kra,z.selfRating, z.experience,  z.firstStep];
            var types = ['danger','info', 'success', 'warning'];
            angular.forEach(zzAxis, function (zz, key) {
                $scope.weights.push({
                    value: zz,
                    type: types[key]
                });
            });

            //************************* OVERALL RATINGS CHART *****************************
            var kraRanking = position.kraSettingsMap;
            angular.forEach(position.scoreCharts.kraTraits, function (kra, key) {
              $scope.kraTraits.push({
                  trait: kra.trait,
                  selfRating: kra.selfRating,
                  experience: kra.experience,
                  score: kra.kraTrait.toFixed(2),
                  ranking: kraRanking['kra'+ (key+1)].order
              });
            });
          var isFavorite = null;
          if(position.favorite) {
            isFavorite = "star active";
          } else {
            isFavorite = "star";
          }
          $scope.positions.push({
            position: position.positionTitle,
            department: position.department,
            status: position.status,
            email: position.email,
            score: position.score,
            editingEnabled: position.editingEnabled,
            workSchedule: position.workSchedule,
            isFavorite: isFavorite,
            pk: position.pk,
            city: position.location.municipality,
            state: position.location.region,
            statusHistory: position.statusHistory,
            kraTraits: $scope.kraTraits,
            weights: $scope.weights,
            xFS: xFS,
            yFS: yFS,
            xProf: xProf,
            yProf: yProf
          });
        });
      }).error( function(data,err,response, request){
        error401 (err);
      });
    };


    $scope.openUploadModal = function () {

      var modalInstance = $modal.open({
        templateUrl: 'applicantUploadAttachmentModal.html',
        controller: 'UploadModalCtrl',
        scope: $scope
        /*resolve: {
         comments: function () {
         return $scope.comments;
         },
         jobTitle: function () {
         return $scope.jobTitle;
         },
         id: function () {
         return id;
         }
         }*/
      });

      modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    };
}]);

