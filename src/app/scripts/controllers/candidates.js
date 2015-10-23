/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('CandidatesCtrl',['$log', '$rootScope','$scope','CandidatesService','$filter','$routeParams','SessionService',
  '$sce', '$timeout', 'sharedSvc','pdfDelegate', '$window',
  function ($log, $rootScope, $scope, CandidatesService, $filter, $routeParams, SessionService,$sce,$timeout,sharedSvc, pdfDelegate, $window) {
    $log.log('CandidatesCtrl');

    $scope.candidates = [];
    $scope.screenerInfo = [];
    $scope.questionnaire = [];
    $scope.questions = [];
    $scope.kraTraits = [];
    $scope.firstStep = {};
    $scope.interviewguide  = [];
    $scope.error = null;
    $scope.preloader = "show";
    $scope.candidate_count = null;
    $scope.collapse = false;
    $scope.showLoading = true;
    $scope.title = SessionService.getTitle();
    $scope.name = SessionService.getApplicantName();
    $scope.currentStatuses = [];
    $scope.archivedStatuses = [];
    $scope.checkboxes = [];
    $scope.collapseCheckboxWarning = true;
    $scope.pdfUrl = 'test.pdf';
    $scope.noCharts = "";

    SessionService.setCandidates([]);

    $scope.collapseSandbox = true;
    $rootScope.showColumn = true;
    $rootScope.showScoring = false;

    var TABLE_WIDTH = "candidate_slide_50";
    var TABLE_WIDTH_100 = "candidate_slide_100"

    $scope.tableWidth = TABLE_WIDTH_100;

    //Sorting and Filtering
    $scope.orderByField = 'modifiedOn';
    $scope.reverseSort = false;
    $scope.filterName = 'name';
    $scope.filteredColumn = null;
    $scope.showNameSearch = true;

    $scope.toggleFilterName = function(type) {
      $scope.showNameSearch = true;
      $scope.localSearch = null;
    };


    $scope.reset = function() {
      $scope.showNameSearch = true;
      $scope.localSearch = null;
      $scope.filterName = null;
      $scope.filteredColumn = null;
    };

    $scope.uniqueItem = function(filter){
      $scope.localSearch = $scope.filteredColumn+"&"+ filter;
    };

    $scope.toggleFilterBy = function(type) {
      $scope.filterName = type;
      $scope.filteredColumn = type;
      $scope.showNameSearch = false;
    };

    $scope.sortBy = function(field, reverseSort) {
        $scope.candidates = $filter('orderBy')($scope.candidates, field, reverseSort);

        angular.forEach($scope.candidates, function (candidate, key) {
            candidate.key = key+1;
        });
        SessionService.setCandidates(JSON.stringify($scope.candidates));
    };
    $scope.$watchCollection('candidates', function (newVal, oldVal) {
    });


      //TOGGLE FAVORITES
    $scope.toggleStar = function(star, id) {
      if (star.currentTarget.className === 'star') {
        star.currentTarget.className = 'star active';
        CandidatesService.favoritesOn(id).success(function(data) {
          setFavorites(id,'star active')
        }).error( function(data,err,response, request){
          star.currentTarget.className = 'star';
          error401(err);
        });
      } else if (star.currentTarget.className === 'star active') {
        star.currentTarget.className = 'star';
        CandidatesService.favoritesOff(id).success(function(data) {
          setFavorites(id,'star')
        }).error( function(data,err,response, request){
          star.currentTarget.className = 'star active';
          error401(err);
        });
      }
    };

    function setFavorites(id,favorite) {
      angular.forEach($scope.candidates, function (candidate, key) {
        if (candidate.pk === id) {
          candidate.isFavorite = favorite;
        }
      });
    }
    lookupCandidateList();

    $scope.isHidden = true;

    $scope.togglePane = function() {
      $scope.error = null;
      $scope.isHidden = !$scope.isHidden;
      $scope.tableWidth = TABLE_WIDTH_100;
      $rootScope.showColumn = true;
      $rootScope.showScoring = false;
    };

    $scope.tabs = [
      { title:"Test1", content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2'},
      { title:'Dynamic Title 3', content:'Dynamic content 3'},
      { title:'Dynamic Title 4', content:'Dynamic content 4'},
      { title:'Dynamic Title 5', content:'Dynamic content 5'}
    ];

    //-----------------------------------------------------
    //               Screeners
    //-----------------------------------------------------
    $scope.toggleScreener = function(araPk, name) {
      $scope.screenerInfo = [];
      $scope.questionnaire = {};
      $scope.questions = [];
      $scope.isHidden = false;
      $scope.showLoading = true;
      $scope.nameTitle = name;
      $scope.araPk = araPk;
      $scope.error = null;

      $rootScope.showColumn =  false;
      $rootScope.showScoring = false;
      $scope.tabs[0].active = true;

      if (araPk === undefined) {
        // on load time, don't know why it is going into toggleScreener function when it is not called.
        $scope.isHidden = true;
        $scope.tableWidth = TABLE_WIDTH_100;
        return;
      } else {
        $scope.tableWidth = TABLE_WIDTH;
      }

      CandidatesService.lookupScreenerInfo(araPk).success(function (screener) {
        if (screener.categories[0] !== undefined ) {
          angular.forEach(screener.categories[0].pages, function (page, key) {
            $scope.questions = [];
            angular.forEach(page.questions, function (question, key) {
              var disqualifier = null;
              if (question.responses[0].isDisqualifyingResponse) {
                disqualifier = "danger";
              } else {
                disqualifier = null;
              }
              $scope.questions.push({
                question: question.text,
                answer: question.responses[0].value,
                disqualifier: disqualifier
              });
            });
            $scope.screenerInfo.push({
              name: page.name,
              questionnaire: $scope.questions,
              status: true
            });
            $scope.showLoading = false;
          });
        } else {
          $scope.screenerInfo.push({
            name: "No Questionnaire"
          });
          $scope.showLoading = false;
        }
      }).error( function(data,err,response, request){
        $scope.screenerInfo.push({
          name: "No Questionnaire"
        });
        $scope.showLoading = false;
        error401(err);
      });
    };

    //-----------------------------------------------------
    //               Charts
    //-----------------------------------------------------
    $scope.toggleCharts = function(pk, araPk, nameTitle) {
      $scope.isHidden = false;
      $scope.showLoading = true;
      $scope.error = null;

      $scope.tableWidth = TABLE_WIDTH;
      $rootScope.showColumn =  false;
      $rootScope.showScoring = false;
      $scope.pk = pk;
      $scope.araPk = araPk;
      $scope.nameTitle = nameTitle;

      $scope.tabs[1].active = true;

      CandidatesService.chartsInfo(araPk).success(function (araInfo) {
          if (araInfo.length === 0) {
            $scope.noCharts = "No Charts Data";
          }
          $scope.kraTraits = [];

          //************************* FIRST STEP TRAITS CHART *****************************
          var xAxis = araInfo.scoreCharts.firstStepTraits.categories;
          var yAxis = araInfo.scoreCharts.firstStepTraits.series[0].data;
          firstStepGraph('#first-step-chart',araInfo.department,araInfo.positionTitle,xAxis, yAxis);

          //************************* PROFILER SCORE CHART *****************************
        var xxAxis = araInfo.scoreCharts.profilerScores.categories;
                if (araInfo.scoreCharts.profilerScores.series.length === 0) {
                    return;
                  }
                var yyAxis = araInfo.scoreCharts.profilerScores.series[0].data;
                profilerGraph(araInfo.department,araInfo.positionTitle,xxAxis, yyAxis);

          //************************* PROFILER WEIGHTS CHART *****************************
          var z = araInfo.scoreCharts.profilerWeights;
          var zzAxis = [z.kra,z.selfRating, z.experience,  z.firstStep];
          $scope.weights = [];
          var types = ['danger','info', 'success', 'warning'];
          //var types = ['success','info', 'warning', 'danger'];
          angular.forEach(zzAxis, function (zz, key) {
            $scope.weights.push({
              value: zz,
              type: types[key]
            });
          });

          //************************* OVERALL RATINGS CHART *****************************
        var kraRanking = araInfo.kraSettingsMap;
                angular.forEach(araInfo.scoreCharts.kraTraits, function (kra, key) {
                    $scope.kraTraits.push({
                        trait: kra.trait,
                        selfRating: kra.selfRating,
                        experience: kra.experience,
                        score: kra.kraTrait.toFixed(2),
                        ranking: kraRanking['kra'+ (key+1)].order
            });

          });

        $scope.showLoading = false;
      }).error( function(data,err,response, request){
        $scope.error = "ERROR"
        $scope.showLoading = false;
        error401(err);
      });
    };

    //-----------------------------------------------------
    //               Paper Clip
    //-----------------------------------------------------
    $scope.toggleClips = function(url,nameTitle) {
      $scope.isHidden = false;
      $scope.showLoading = true;
      $scope.nameTitle = nameTitle;
      $scope.attachmentUrl = url;
      $scope.error = null;

      $scope.tableWidth = TABLE_WIDTH;
      $rootScope.showColumn =  false;
      $rootScope.showScoring = false;

      $scope.tabs[2].active = true;

//      CandidatesService.resumePdf("/hiretrue/"+url).success(function (pdf) {
//        var file = new Blob([pdf], {type: 'application/pdf'});
//        var urlObj = URL.createObjectURL(file);
//        pdfDelegate.$getByHandle('resume-pdf-container').load(urlObj);
//        $scope.showLoading = false;
//      }).error(function(){
//        $scope.error = "ERROR"
//        $scope.showLoading = false;
//      });

    };



    //-----------------------------------------------------
    //               First Steps
    //-----------------------------------------------------
    $scope.toggleFirstSteps = function(araPk,nameTitle) {
      $scope.isHidden = false;
      $scope.showLoading = true;
      $scope.nameTitle = nameTitle;
      $scope.araPk = araPk;
      $scope.error = null;

      $scope.tableWidth = TABLE_WIDTH;
      $rootScope.showColumn = false;
      $rootScope.showScoring = false;

      $scope.tabs[3].active = true;

      if (araPk === undefined) {
        return;
      }

      CandidatesService.firstStep(araPk).success(function (data) {
        $scope.firstStep  = {
          assertiveness: data.data.traitParagraphMap.A,
          empathy: data.data.traitParagraphMap.EMP1,
          confidence: data.data.traitParagraphMap.CONF,
          sociability: data.data.traitParagraphMap.O,
          helpfulness: data.data.traitParagraphMap.P,
          thoroughness: data.data.traitParagraphMap.R,
          problemSolving: data.data.traitParagraphMap.RR1
        }
        $scope.showLoading = false;
      }).error( function(data,err,response, request){
        $scope.error = "ERROR";
        $scope.showLoading = false;
        error401(err);
      });


      CandidatesService.chartsInfo(araPk).success(function (araInfo) {
        if (araInfo.length === 0) {
          $scope.noCharts = "No Charts Data";
        }
        $scope.kraTraits = [];

        //************************* FIRST STEP TRAITS CHART *****************************
        var xAxis = araInfo.scoreCharts.firstStepTraits.categories;
        var yAxis = araInfo.scoreCharts.firstStepTraits.series[0].data;
        firstStepGraph('#first-step',araInfo.department,araInfo.positionTitle,xAxis, yAxis);

        $scope.showLoading = false;
      }).error( function(data,err,response, request){
        $scope.error = "ERROR";
        $scope.showLoading = false;
        error401(err);
      });
    };

    //-----------------------------------------------------
    //              Interview Guide
    //-----------------------------------------------------
    $scope.toggleInterviewGuide = function(araPk,nameTitle) {
      $scope.isHidden = false;
      $scope.showLoading = true;
      $scope.nameTitle = nameTitle;
      $scope.error = null;

      $scope.tableWidth = TABLE_WIDTH;
      $rootScope.showColumn = false;
      $rootScope.showScoring = false;

      $scope.tabs[4].active = true;

        if (araPk === undefined) {
            return;
        }
      CandidatesService.interviewGuide(araPk).success(function (guide) {
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
        $scope.showLoading = false;
      }).error( function(data,err,response, request){
        $scope.error = "ERROR"
        $scope.showLoading = false;
        error401(err)
      });

      CandidatesService.chartsInfo(araPk).success(function (araInfo) {
          if (araInfo.length === 0) {
            $scope.noCharts = "No Charts Data";
          }
          $scope.kraTraits = [];

          //************************* INTERVIEW GUIDE TRAITS CHART *****************************
          var xAxis = araInfo.scoreCharts.firstStepTraits.categories;
          var yAxis = araInfo.scoreCharts.firstStepTraits.series[0].data;
          firstStepGraph('#interview-guide',araInfo.department,araInfo.positionTitle,xAxis, yAxis);

          $scope.showLoading = false;
      }).error( function(data,err,response, request){
          $scope.error = "ERROR"
          $scope.showLoading = false;
          error401(err);
        });
    };

//    $scope.toggleFirstStepsPdf = function(araPk,nameTitle) {
//      $scope.isHidden = false;
//      $scope.showLoading = true;
//      $scope.nameTitle = nameTitle;
//      $scope.error = null;
//
//      $scope.tableWidth = TABLE_WIDTH;
//      $rootScope.showColumn =  false;
//      $rootScope.showScoring = false;
//
//      $scope.tabs[3].active = true;
//
//      CandidatesService.firstStepPdf(araPk).success(function (pdf) {
//        var file = new Blob([pdf], {type: 'application/pdf'});
//        var urlObj = URL.createObjectURL(file);
//        pdfDelegate.$getByHandle('pdf-container').load(urlObj);
//        $scope.showLoading = false;
//      }).error(function(){
//        $scope.error = "ERROR"
//        $scope.showLoading = false;
//      });
//    };

    // toggle selection for a given employee by name
    $scope.toggleAll = function(bool){
      $scope.checkboxes = [];
      if(bool) {
        angular.forEach($scope.candidates, function (candidate, key) {
          candidate.checked = true;
          $scope.checkboxes.push({'pk':candidate.pk,'araPk':candidate.araPk,'email':candidate.email});
        });
      } else {
        angular.forEach($scope.candidates, function (candidate, key) {
          candidate.checked = false;
        });
      }
    };

    // toggle selection for a given employee by name
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

    $scope.enableEditing = function() {
      if ($scope.checkboxes.length === 0) {
        $scope.addAlert();
        // Loadind done here - Show message for 3 more seconds.
        $timeout(function() {
          $scope.closeAlert();
        }, 3000);
      } else {
        CandidatesService.editEnabled($scope.checkboxes).success(function (data) {
          $scope.candidates = [];
          lookupCandidateList();
        }).error( function(data,err,response, request){
          $scope.error = "ERROR"
          $scope.showLoading = false;
          error401(err);
        });
      }
    };

    $scope.changeStatus = function(statusId) {
      if ($scope.checkboxes.length === 0) {
        $scope.addAlert();
        // Loadind done here - Show message for 3 more seconds.
        $timeout(function() {
          $scope.closeAlert();
        }, 3000);
      } else {
        var araList = [];
        angular.forEach($scope.checkboxes, function (checkbox, key) {
          araList.push(checkbox.araPk);
        });

        CandidatesService.changeStatuses(statusId,araList).success(function (data) {
          $scope.candidates = [];
          lookupCandidateList();
        }).error( function(data,err,response, request){
          $scope.error = "ERROR"
          $scope.showLoading = false;
          error401(err);
        });
      }
    }

    $scope.addAlert = function() {
      $scope.collapseCheckboxWarning = false;
    };

    $scope.closeAlert = function () {
      $scope.collapseCheckboxWarning = true;
    };

    $scope.statusAcc = {
      isOpen: true
    };

    /******************************************************************************
     *  JS FUNCTIONS
     ****************************************************************************/
    function error401 (err) {
      if (err === 401) {
        SessionService.setTimedOut("ERROR");
        $window.location.href = "#/login";
      }
    }

    function lookupCandidateList() {
      $scope.candidates = [];
      $scope.preloader = "show";
      $scope.checkboxes = [];
      $scope.currentStatuses = [];
      $scope.archivedStatuses = [];

      CandidatesService.lookupCandidateList($routeParams.pk,$routeParams.status).success(function (candidate_data) {
        $scope.candidate_count = candidate_data.length;

        angular.forEach(candidate_data.availableStatuses.activeStatuses, function (status, key) {
          $scope.currentStatuses.push({
            id: status.key,
            name: status.label
          });
        });
        angular.forEach(candidate_data.availableStatuses.archivedStatuses, function (status, key) {
          $scope.archivedStatuses.push({
            id: status.key,
            name: status.label
          });
        });

        angular.forEach(candidate_data.candidateInfos, function (candidate, key) {
          var scoreColor = null;
          if (candidate.score < 50) {
            scoreColor = "warn";
          } else if (candidate.score < 70) {
            scoreColor = "info";
          } else {
            scoreColor = "good";
          }
          $scope.candidates.push({
            name: candidate.name,
            Status: candidate.status,
            email: candidate.email,
            phone: candidate.phone,
            readByUser: candidate.readByUser,
            score: candidate.score,
            scoreColor: scoreColor,
            modifiedOn: candidate.modifiedOn,
            multiJobFlag: candidate.appliedForMoreThenOneJobFlag ? "flag bg multiEnabled": "flag bg multiEnabled disabled",
            backgroundCheckFlag: candidate.backgroundCheckFlag ? "flag bg backgroundCheck": "flag bg backgroundCheck disabled",
            skillsAssessmentFlag: candidate.hasSkillAssessment ? "flag bg userTree": "flag bg userTree disabled",
            editEnabledFlag: candidate.isCandidateEditEnabled ? "flag bg editEnabled":"flag bg editEnabled disabled" ,
            remarksFlag: candidate.remarksFlag ? "flag bg comments ": "flag bg comments disabled",
            isFavorite: candidate.favorite ? "star active": "star",
            attachmentUrl: candidate.resumeDocPdfUrl,
            pk: candidate.pk,
            araPk: candidate.araPk,
            checked: false
          });
        });

        //SORT These CANDIDATES
        $scope.sortBy('modifiedOn',true);
        SessionService.setCandidates(JSON.stringify($scope.candidates));
        $scope.error = null;
        $scope.preloader = null;
      }).error( function(data,err,response, request){
        $scope.error = "error";
        $scope.preloader = null;
        error401(err);
      });
    }

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

    function profilerGraph(department,position,x,yy) {
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
        subtitle: {text: 'Position:' + position},
        xAxis: {
          categories: x,
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          increment:10,
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
