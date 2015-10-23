/**
 * Created by Joseph on 2/1/2015.
 */
'use strict';

hiretrueApp.controller('ModalCtrl',['$rootScope','$scope','CandidatesService','$filter','$routeParams','SessionService',
  '$sce', '$timeout', 'sharedSvc','pdfDelegate','$modal',
  function ($rootScope, $scope, CandidatesService, $filter, $routeParams, SessionService,$sce,$timeout,sharedSvc, pdfDelegate,
            $modal) {

    $scope.pk = $routeParams.pk
    /*
     ******************************  COMMENTS Modal *****************************
     */
    $scope.comments = [];
    $scope.jobTitle = null;

    $scope.openModalComment = function (id,name) {
      $scope.jobTitle = name;
      $scope.comments = [];

      CandidatesService.commentList(id).success(function(commentData) {

        angular.forEach(commentData.data, function (comment, key) {
          $scope.comments.push({
            comment: comment.comment,
            user: comment.user,
            created: comment.created
          });
        });
        var modalInstance = $modal.open({
          templateUrl: 'candidateCommentsModal.html',
          controller: 'CandidateCommentsModalCtrl',
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
        }, function () {
        });

        $scope.error = null;
        $scope.preloader = null;
      }).error( function(err){
        $scope.error = "error";
        $scope.preloader = null;
      });
    };


    /*
     ******************************  EMAIL Modal *****************************
     */
    $scope.emails = [];

    $scope.openModalEmail = function (emails) {
      $scope.emails = emails;

      var $modalInstance = $modal.open({
        templateUrl: 'candidateEmailModal.html',
        controller: 'CandidateEmailModalCtrl',
        scope: $scope,
        resolve: {
          emails: function () {
            return $scope.emails;
          }
        }
      });

      $modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    }

    $scope.openResendEmail = function (pk, data) {

              var $modalInstance = $modal.open({
                templateUrl: 'candidateResendEmail.html',
                controller: 'CandidateResendEmailCtrl',
                resolve: {
                  pk: function () {
                      return pk;
                    },
                  data: function () {
                    return data;
                  }
                }
            });

      $modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    }

    /*
     ******************************  SANDBOX Modal *****************************
     */

    $scope.toggleSandbox = function () {

      var $modalInstance = $modal.open({
        templateUrl: 'sandboxModal.html',
        controller: 'SandboxModalCtrl',
        windowClass: 'app-modal-window',
        resolve: {
          showColum: function () {
            return  '';
          },
          showScoring: function () {
            return  '';
          }
        }
      });

      $modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    }

    /*
     ******************************  Print Modal *****************************
     */

    $scope.openModalPrint = function (applicants) {

      $scope.applicants = applicants;

      var $modalInstance = $modal.open({
        templateUrl: 'printModal.html',
        controller: 'PrintModalCtrl',
        size: 'sm',
        resolve: {
          applicants: function () {
            return  $scope.applicants;
          }
        }
      });

      $modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    }

    /*
     ******************************  Watch Modal *****************************
     */
    $scope.openModalWatch = function (pk, name) {
      var $modalInstance = $modal.open({
        templateUrl: 'watchModal.html',
        controller: 'WatchModalCtrl',
        size: 'sm',
        scope: $scope,
        resolve: {
          applicantPk: function () {
            return  pk;
          }
        }
      });

      $modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    }

    $scope.openForgotPassword = function (email) {
      var $modalInstance = $modal.open({
        templateUrl: 'forgotPasswordModal.html',
        controller: 'ForgotPasswordModalCtrl',
        scope: $scope,
        resolve: {
          emails: function () {
            return $scope.emails;
          }
        }
      });

      $modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    }

    /*
     ******************************  Help Modal *****************************
     */

    $scope.openModalHelp = function () {

      var $modalInstance = $modal.open({
        templateUrl: 'helpModal.html',
        controller: 'HelpModalCtrl',
        size: 'sm',
        resolve: {
          applicants: function () {
            return  $scope.applicants;
          }
        }
      });

      $modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    }

  }]);




// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

hiretrueApp.controller('CandidateCommentsModalCtrl',['$scope', '$modalInstance', 'CandidatesService', 'comments', 'jobTitle', 'id',
  '$timeout', function ($scope, $modalInstance, CandidatesService, comments, jobTitle, id,$timeout) {

    $scope.collapseAddedWarning = true;
    $scope.comments = comments;
    $scope.jobTitle = jobTitle;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.addComment = function(form) {

      CandidatesService.addComment(id, form.comment, false).success(function(d) {
        $scope.collapseAddedWarning = false;
        $timeout(function() {
          $scope.collapseAddedWarning = true;
        }, 3000);
        $scope.comments = [];
        CandidatesService.commentList(id).success(function(commentData) {

          angular.forEach(commentData.data, function (comment, key) {
            $scope.comments.push({
              comment: comment.comment,
              user: comment.user,
              created: comment.created
            });
          });
          form.comment = '';
        });
      }).error(function(err){
        //error
      });
    };
    $scope.$watchCollection('comments', function (newVal, oldVal) {
    });
  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
hiretrueApp.controller('CandidateEmailModalCtrl',['$scope', '$modalInstance', 'CandidatesService', 'emails',
  '$timeout', function ($scope, $modalInstance, CandidatesService, emails, $timeout) {

    $scope.emailForm = {
      'from': sessionStorage.email,
      'body': ""
    };
    $scope.collapseSentWarning = true;
    $scope.collapseSelectedWarning = true;
    $scope.akaPks = [];
    $scope.pks = [];
    $scope.emailTemplate = [];
    $scope.selectedTemplate = {};
    $scope.disabled = '';

    $scope.candidates = $scope.$parent.candidates;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.tinymceOptions = {
        onChange: function(e) {
            // put logic here for keypress and cut/paste changes
        },
        inline: false,
        plugins : 'advlist autolink link image lists charmap print preview',
        skin: 'lightgray',
        theme : 'modern'
    };


    if(emails.length === 0) {
      $scope.collapseSelectedWarning = false;
      $timeout(function() {
        $scope.collapseSelectedWarning = true;
      }, 3000);
      return;
    }
    angular.forEach(emails, function (email, key) {
      $scope.akaPks.push(email.araPk);
      $scope.pks.push(email.pk);
    });

    if($scope.akaPks.length === 0) {
      $scope.collapseSelectedWarning = false;
      $timeout(function() {
        $scope.collapseSelectedWarning = true;
      }, 3000);
      return;
    }


    CandidatesService.emailTemplates($scope.pks).success(function(templates) {
      $scope.emailTemplate = templates.data.templates;

      angular.forEach($scope.emailTemplate, function (template, key) {
        if (template.from === null || template.from === undefined) {
          template.from = sessionStorage.email;
        }
      });
      console.log( $scope.emailTemplate)
    }).error(function(err){
      //error
    });

    $scope.getTemplate = function() {
      angular.forEach($scope.emailTemplate, function (template, key) {
        if (template.pk === $scope.selectedTemplate.template.pk) {
          $scope.emailForm = template;
        }

      });
    }

    $scope.sendEmails = function(form) {
      CandidatesService.sendEmail( form.subject,form.body,$scope.akaPks).success(function(success) {
        $scope.collapseSentWarning = false;
        $timeout(function() {
          $scope.collapseSentWarning = true;
          $scope.disabled = 'disabled';
        }, 3000);
      }).error(function(err){
        //error
        $scope.disabled = '';
      });

    };

   }]);


hiretrueApp.controller('UploadModalCtrl',['$scope', '$modalInstance', 'Upload',
  '$timeout', function ($scope, $modalInstance, Upload, $timeout) {

    $scope.private = false;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          Upload.upload({
            url: '/hiretrue/api/file/upload/' + $scope.applicantPk,
            fields: {'private': $scope.private},
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
          }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
          })
        }
      }
    };
  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
hiretrueApp.controller('SandboxModalCtrl',['$rootScope','$scope', '$modalInstance', 'CandidatesService', 'showColum','showScoring',
  '$timeout', function ($rootScope, $scope, $modalInstance, CandidatesService, showColum,showScoring, $timeout) {


    //-----------------------------------------------------
    //               DnD SANDBOX
    //-----------------------------------------------------

    $scope.sandboxKra = [
      'Generating New Business',
      'Solving Complex Problems',
      'Cultivating Exiting Business',
      'Providing Service to Others',
      'Working with Data',
      'Managing Others',
      'Entreprenerial Leadership',
      'Working on a Team',
      'Planning and Organizing Activities',
      'Working with Things'
    ];


    $scope.rescoreKra = [];

    $scope.dropSuccessHandler = function($event,index,array){
      array.splice(index,1);
    };

    $scope.onDrop = function($event,$data,array){
      array.push($data);
    };

    $scope.kra = {
      name: 'KRA',
      value: 5
    };

    $scope.rating = {
      name: 'Self-Rating',
      value: 5
    };
    $scope.experience = {
      name: 'Experience',
      value: 5
    };
    $scope.firststep = {
      name: 'First Step',
      value: 5
    };

    $scope.cancel = function () {
      $rootScope.showColumn = true;
      $rootScope.showScoring = false;

      $modalInstance.dismiss('cancel');
    };

    $scope.rescore = function(form) {
      $rootScope.showColumn = false;
      $rootScope.showScoring = true;
    };

    $scope.recalculate = function(form) {
    };

  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
  hiretrueApp.controller('CandidateResendEmailCtrl',['$scope', '$modalInstance', 'CandidatesService', 'pk',
      '$timeout', 'data', function ($scope, $modalInstance, CandidatesService, pk, $timeout, data) {

            $scope.collapseSentWarning = true;

             $scope.emailForm = {
              from: data.from,
              subject: data.subject,
              body: data.body
          }

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };


              $scope.resendEmailNow = function(form) {
              CandidatesService.resendEmail(pk).success(function(success) {
                  $scope.collapseSentWarning = false;
                  $timeout(function() {
                      $scope.collapseSentWarning = true;
                      $scope.disabled = 'disabled';
                    }, 3000);
                }).error(function(err){
                  //error
                    $scope.disabled = '';
                });
            };
        }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
hiretrueApp.controller('PrintModalCtrl',['$rootScope','$scope', '$modalInstance', 'CandidatesService', 'applicants',
  '$timeout', function ($rootScope, $scope, $modalInstance, CandidatesService, applicants, $timeout) {


    //-----------------------------------------------------
    //               Print
    //-----------------------------------------------------
    $scope.collapseSelectedWarning = true;
    $scope.collapsePrintWarning = true;
    $scope.pks = [];
    $scope.printList = [];
    $scope.attprintList = [];

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


    if(applicants.length === 0) {
      $scope.collapseSelectedWarning = false;
      $timeout(function() {
        $scope.collapseSelectedWarning = true;
      }, 3000);
      return;
    }
    angular.forEach(applicants, function (applicant, key) {
      $scope.pks.push(applicant.pk);
    });

    CandidatesService.printList( $scope.pks).success(function(list) {
      console.log(list.data);
      angular.forEach(list.data.questionSetTypes, function (type, key) {
        $scope.printList.push({name:type, id:key,checked:false});
      });
      angular.forEach(list.data.attachmentTypes, function (atttype, key) {
        $scope.attprintList.push({name:atttype, id:key,checked:false});
      });

    }).error(function(err){
      //error
    });

    // toggle selection for a given employee by name
    $scope.toggleAll = function(bool){
      if(bool) {
        angular.forEach($scope.printList, function (print, key) {
          print.checked = true;
        });
        angular.forEach($scope.attprintList, function (attprint, key) {
          attprint.checked = true;
        });
      } else {
        angular.forEach($scope.printList, function (print, key) {
          print.checked = false;
        });
        angular.forEach($scope.attprintList, function (attprint, key) {
          attprint.checked = false;
        });
      }
    };

    // toggle selection for a given employee by name
    $scope.toggleSelection = function(bool, id){
      if(bool){
        angular.forEach($scope.printList, function (print, key) {
          if (print.id === id) {
            print.checked = true;
          }
        });
      } else {
        angular.forEach($scope.printList, function (print, key) {
          if (print.id === id) {
            print.checked = false;
          }
        });
      }
    };

    // toggle selection for a given employee by name
    $scope.toggleAttSelection = function(bool, id){
      if(bool){
        angular.forEach($scope.attprintList, function (attprint, key) {
          if (attprint.id === id) {
            attprint.checked = true;
          }
        });
      } else {
        angular.forEach($scope.attprintList, function (attprint, key) {
          if (attprint.id === id) {
            attprint.checked = false;
          }
        });
      }
    };

    $scope.print = function() {
      var questionSetTypes = [];
      var applicantPks = [];
      var attachTypes = [];

      angular.forEach(applicants, function (applicant, key) {
        applicantPks.push({
          applicantPk: applicant.pk
        })
      });

      angular.forEach( $scope.printList, function (checkedItem, key) {
        if (checkedItem.checked) {
          questionSetTypes.push(checkedItem.name);
        }
      });

      angular.forEach( $scope.attprintList, function (attcheckedItem, key) {
        if (attcheckedItem.checked) {
          attachTypes.push(attcheckedItem.name);
        }
      });

      if(attachTypes.length === 0 && questionSetTypes.length === 0) {
        $scope.collapsePrintWarning = false;
        $timeout(function() {
          $scope.collapsePrintWarning = true;
        }, 3000);
        return;
      }

      var _data = {
        applicants: applicantPks,
        questionSetTypes: questionSetTypes,
        attachmentTypes: attachTypes
      };

        window.open("/hiretrue/api/candidate/print-info/pdf?multipleCandidatePrintStr=" + JSON.stringify(_data));
//
//      }).error(function(err){
//        //error
//      });
    };

  }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
hiretrueApp.controller('WatchModalCtrl',['$rootScope','$scope', '$modalInstance', 'CandidatesService', 'applicantPk',
  '$timeout', function ($rootScope, $scope, $modalInstance, CandidatesService, applicantPk, $timeout) {

    //-----------------------------------------------------
    //               Watch
    //-----------------------------------------------------
    $scope.collapseFolderWarning = true;
    $scope.collapseWatchedWarning = true;
    $scope.collapseNoFolderNameWarning = true;
    $scope.collapseSelectedFolderWarning = true;
    $scope.options = [];
    $scope.folderSelected = {};
    $scope.folderSelected.name = null;
    $scope.disabled = '';
    $scope.watchRadio = {
      name: ''
    };

    $scope.newWatchList = {};
    $scope.newWatchList.name = null;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    getWatchList();

    $scope.addWatch = function() {
      if($scope.watchRadio.name === 'existing' &&
        $scope.options.length === 1 &&
        $scope.options[0].pk === 0) {
        $scope.collapseFolderWarning = false;
        $timeout(function() {
          $scope.collapseFolderWarning = true;
        }, 3000);
        return;
      }
      if($scope.watchRadio.name === 'new' &&
        $scope.newWatchList.name === null) {
        $scope.collapseNoFolderNameWarning = false;
        $timeout(function() {
          $scope.collapseNoFolderNameWarning = true;
        }, 3000);
        return;
      }
      if($scope.watchRadio.name === 'new') {
        //Add Applicant to Watch by creating a Folder!
        CandidatesService.watchListAddApplicant($scope.newWatchList.name,applicantPk).success(function(folder) {
          getWatchList();
          $scope.collapseWatchedWarning = false;
          $timeout(function() {
            $scope.collapseWatchedWarning = true;
          }, 3000);
          $scope.disabled = 'disabled';
        }).error(function(err){
          $scope.disabled = '';
          //error
        });
      } else {
        if ($scope.folderSelected.name === null || $scope.folderSelected.name === undefined) {
          $scope.collapseSelectedFolderWarning = false;
          $timeout(function() {
            $scope.collapseSelectedFolderWarning = true;
          }, 3000);
          return;
        }
        CandidatesService.addWatchListApplicant($scope.folderSelected.name.pk,  applicantPk).success(function(applicant) {
          $scope.collapseWatchedWarning = false;
          $timeout(function() {
            $scope.collapseWatchedWarning = true;
          }, 3000);
          $scope.disabled = 'disabled';
        }).error(function(err){
          //error
          $scope.disabled = '';
        });
      }

    }
    $scope.$watchCollection('options', function (newVal, oldVal) {
    });

    function getWatchList() {
      CandidatesService.watchList().success(function(folders) {
        console.log(folders)
        if (folders.groups.Ungrouped === undefined) {
          $scope.options.push({name: "No Watch Folders",pk:0})
        } else {
          $scope.options =  folders.groups.Ungrouped;
        }
      }).error(function(err){
        //error
      });
    }

  }]);

hiretrueApp.controller('ForgotPasswordModalCtrl',['$scope', '$modalInstance', 'CandidatesService', 'emails',
   function ($scope, $modalInstance, CandidatesService, emails) {

     $scope.collapseAddedWarning = true;
     $scope.main = {};


     $scope.cancel = function () {
       $modalInstance.dismiss('cancel');
     };
   }]);

hiretrueApp.controller('HelpModalCtrl',['$scope', '$modalInstance', 'CandidatesService',
   function ($scope, $modalInstance, CandidatesService) {

     $scope.collapseAddedWarning = true;
     $scope.main = {};


     $scope.cancel = function () {
       $modalInstance.dismiss('cancel');
     };
   }]);

hiretrueApp.controller('StageModalCtrl',['$scope', '$modalInstance', 'CandidatesService',
  function ($scope, $modalInstance, CandidatesService) {

    $scope.collapseAddedWarning = true;
    $scope.main = {};
    $scope.rows = ['Row 1', 'Row 2'];

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
