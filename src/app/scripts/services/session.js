/**
 * Created by Joseph on 2/4/2015.
 */
'use strict';
hiretrueApp.factory('SessionService', function() {

  var svc = {};

  svc.getTitle = function() {
    return sessionStorage.title;
  };

  svc.setTitle = function(title) {
    sessionStorage.title = title;
  };

  svc.getTimedOut = function() {
    return sessionStorage.timedOut;
  };

  svc.setTimedOut = function(timedOut) {
    sessionStorage.timedOut = timedOut;
  };

  svc.getUserName = function() {
    return sessionStorage.username;
  };

  svc.setUserName = function(username) {
    sessionStorage.username = username;
  };

  svc.getApplicantName = function() {
    return sessionStorage.applicantname;
  };

  svc.setApplicantname = function(applicantname) {
    sessionStorage.applicantname = applicantname;
  };

  svc.getUserEmail = function() {
    return sessionStorage.useremail;
  };

  svc.setUserEmail = function(useremail) {
    sessionStorage.useremail = useremail;
  };

  svc.getUserId = function() {
    return sessionStorage.userid;
  };

  svc.setUserId = function(userid) {
    sessionStorage.userid = userid;
  };

  svc.getUserType = function() {
    return sessionStorage.usertype;
  };

  svc.setUserType = function(usertype) {
    sessionStorage.usertype = usertype;
  };

  svc.getCandidates = function() {
    return sessionStorage.candidates;
  };

  svc.setCandidates = function(candidates) {
    sessionStorage.candidates = candidates;
  };

  svc.getApplicant = function() {
    return sessionStorage.applicant;
  };

  svc.setApplicant = function(applicant) {
    sessionStorage.applicant = applicant;
  };

  return svc;
});
