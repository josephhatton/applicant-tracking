'use strict';

angular.module('hiretrueApp')
  .factory('CandidatesService',['$http','sharedSvc' ,  function ($http, sharedSvc) {
    // Service logic
    // ...

    var srv = {};

    // Public API here
      srv.lookupCandidateList = function (pid,status) {
        var url = "/hiretrue/api/candidate/v2/list?positionPk="+pid+"&status="+status;
        return $http.get(url);
    };

    // Public API here
    srv.applicantPositionList = function (pid) {
      var url = "/hiretrue/api/candidate/araInfoList?applicantPk="+pid;
      return $http.get(url);
    };

    srv.lookupScreenerInfo = function (pid) {
      var url = "/hiretrue/api/candidate/araScreenerInfo/"+ pid;
      return $http.get(url);
    };

    srv.favoritesOn = function (pid) {
      var url = "/hiretrue/api/candidate/favorite/on/"+ pid;
      return $http.get(url);
    };
    srv.favoritesOff = function (pid) {
      var url = "/hiretrue/api/candidate/favorite/off/"+ pid;
      return $http.get(url);
    };

    srv.chartsInfo = function (araPk) {
      var url = "/hiretrue/api/candidate/araInfo/"+ araPk;
      return $http.get(url);
    };

    srv.chartsList = function (pk) {
      var url = "/hiretrue/api/candidate/araInfoList?applicantPk="+ pk;
      return $http.get(url);
    };

    srv.firstStep = function (araPk) {
      var url = "/hiretrue/api/candidate/first-step/firstStepAssessmentInfo?firstStepOrderPk=0&araPk="+ araPk;
      return $http.get(url);
    };

    srv.firstStepPdf = function (araPk) {
      var url = "/hiretrue/api/candidate/first-step/pdf?firstStepOrderPk=0&araPk="+ araPk;
      return $http.get(url,{responseType: "arraybuffer"});
    };

    srv.interviewGuide = function (araPk) {
      var url = "/hiretrue/api/candidate/interview-guide?araPk="+ araPk;
      return $http.get(url);
    };

    srv.editEnabled = function (list) {
      var url = "/hiretrue/api/candidate/edit/enable";

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: JSON.stringify(list)
      });
    };

    srv.editDisabled = function (list) {
      var url = "/hiretrue/api/candidate/edit/disable";

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: JSON.stringify(list)
      });
    };

    srv.resumePdf = function (url) {
      return $http.get(url,{responseType: "arraybuffer"});
    };

    srv.changeStatuses = function (statusId,list) {
      var url = "/hiretrue/api/candidate/status/edit/"+statusId;

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: list
      });
    };

    srv.publicOn = function(commentPk) {
      var url = "/hiretrue/api/comment/viewable/on/" + commentPk;

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        }
      });
    }

    srv.publicOff = function(commentPk) {
      var url = "/hiretrue/api/comment/viewable/off/" + commentPk;

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        }
      });
    }

    // Public API here
    srv.addComment = function (id,comment, bool) {
      var url = "/hiretrue/api/comment/add";

      var data = {
        applicantPk: id,
        publicComment: bool,
        comment: comment
      };
      return $http.post(url,data);
    };

    // Public API here
    srv.updateComment = function (id,comment, bool) {
      var url = "/hiretrue/api/comment/edit";

      var data = {
        pk: id,
        publicComment: bool,
        comment: comment
      };
      return $http.post(url,data);
    };

    // Public API here
    srv.deleteComment = function (pk) {
      var url = "/hiretrue/api/comment/delete";

      var data = {
        pk: pk
      };
      return $http.post(url,data);
    };

    // Public API here
    srv.commentList = function (id) {
      var url = "/hiretrue/api/comment/list/"+id;

      var data = {
      };
      return $http.get(url,data);
    };

    // Public API here
        srv.updateApplicant = function (applicant) {
              var url = "/hiretrue/api/candidate/edit";

          /*return $http({
            method: 'POST',
            url: url,
            headers: {
              'Content-Type': "application/json; charset=utf-8",
              'dataType': 'json'
            },
            data: applicant
          });*/
               /* var _data = {
                  pk: pk,
                  addressPk: 13151,
                  address2Pk: null,
                  legalName: "",
                  givenName: "EditTest",
                  preferredGivenName: "",
                  middleName: "",
                  familyName: "Doe",
                  affixType: "",
                  affix: "",
                  familyNamePrefix: "",
                  email: "doe-test@test.com",
                  phone: ""
              }*/
          var applicantInfo = {
            pk: applicant.pk,
            addressPk: applicant.addressPk,
            address2Pk: applicant.address2Pk,
            email:applicant.email,
            phone: applicant.phone,
            applicantPk: applicant.key,
            name: {
                legalName: applicant.name.legalName,
                givenName: applicant.name.givenName,
                preferredGivenName: applicant.name.preferredGivenName,
                middleName: applicant.name.middleName,
                familyName: applicant.name.familyName,
                familyNamePrefix: applicant.name.familyNamePrefix,
                affix: applicant.name.affix,
                affixType: applicant.name.affixType,
                primaryKey: applicant.name.primaryKey
            },
            address: {
              primaryKey: applicant.address1.primaryKey,
              type: applicant.address1.type,
              countryCode: applicant.address1.countryCode,
              streetName: applicant.address1.streetName,
              buildingNumber: applicant.address1.buildingNumber,
              unit: applicant.address1.unit,
              postOfficeBox: applicant.address1.postOfficeBox,
              personName: applicant.address1.personName,
              additionalText: applicant.address1.additionalText,
              organization: applicant.address1.organization,
              organizationName: applicant.address1.organizationName,
              addressLine: applicant.address1.addressLine1,
              addressLine2: applicant.address1.addressLine2,
              municipality: applicant.address1.city,
              region: applicant.address1.state,
              postalCode: applicant.address1.postalCode
            },

            ssn: applicant.ssn,
            dateOfBirth: applicant.dateOfBirth
          }
            return $http.post(url,applicantInfo);
        };

    // Public API here
    srv.sendEmail = function (subject, body, pks,templatePk) {
      var url = "/hiretrue/api/email/applicants/send";

      var data = {
        applicantPks: pks,
        subject: subject,
        from: 'admin@kiosite.com',
        body: body,
        templatePk: templatePk
      };
      return $http.post(url,data);
    };

    // Public API here
    srv.emailTemplates = function (pks) {
      var url = "/hiretrue/api/email/applicants/prepare";

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: JSON.stringify({ 'applicantPks': pks })
      });
    };
    //Public API
    srv.resendEmail = function (pk) {
      var url = "/hiretrue/api/email/applicants/resend";

      var data = {
        pk: pk
      };
      return $http.post(url,data);
    };

    // Public API here
    srv.printList = function ( pks) {
      var url = "/hiretrue/api/candidate/print-info";

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: pks
      });
    };

    // Public API here
    srv.watchList = function () {
    var url = "/hiretrue/api/user/watchlist-list";
      return $http.get(url);
    };

    // Public API here
    srv.addWatchListFolder = function (folderName) {
      var url = "/hiretrue/api/user/watchlist-create";

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: folderName
      });
    };

    // Public API here
    srv.addWatchListApplicant = function (folderPk, applicantPk ) {
      var url = "/hiretrue/api/user/watchlist/applicant/add";
      var data = {
        watchListPk: folderPk,
        applicantPks: [applicantPk]
      }
      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: JSON.stringify(data)
      });
    };

    srv.watchListAddApplicant = function (name, applicantPk ) {
      var url = "/hiretrue/api/user/watchlist-create/applicant/add";
      var data = {
        name: name,
        applicantPks: [applicantPk]
      }
      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: JSON.stringify(data)
      });
    };

    srv.forwardEmail = function (first, last, email,expires, applicantPk,
      questionaire, comments, background, skill, behavior, positions,
      attachments,emails, print) {
      var url = "/hiretrue/api/email/applicants/forward/create";
      var data = {
        firstName: first,
        lastName: last,
        email: email,
        loginKey: null,
        applicantPk: applicantPk,
        expiresAfter: expires,
        showQuestionnaires: questionaire,
        showComments: comments,
        showBackgroundChecks: background,
        showSkillAssessments: skill,
        showBehavioralAssessments: behavior,
        showPositions: positions,
        showAttachments: attachments,
        showEmails: emails,
        showPrintWizard: print
      };

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'dataType': 'json'
        },
        data: JSON.stringify(data)
      });
    };


    srv.questionnaires = function (pk) {
        var url = "/hiretrue/api/questionnaireResponses/view?applicantPk="+ pk;
        return $http.get(url);
    };

    var showColumn = true;
    var showScoring = false;

    srv.toggleColumn = {
      get showColumn() { return showColumn; },
      set showColumn(val) { showColumn = val; }
    };

    srv.toggleColumn = {
      get showScoring() { return showScoring; },
      set showScoring(val) { showScoring = val; }
    };

    return srv;
  }]);
