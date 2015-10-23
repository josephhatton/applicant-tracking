/*global angular: false,  */

(function () {
  'use strict';

  var module = angular.module('SharedModule', []);

  module.factory('sharedSvc', function ($log, $http, $location) {
    $log.log("shared-svc-module::sharedSvc");

    var svc = {};

    svc.applicantInfo = function (pk,araPk) {
      var url = "/hiretrue/api/candidate/view?applicantPk="+ pk+"&araPk="+araPk;
      return $http.get(url);
    };

    svc.lookupStatuses = function (pk) {
      var url = "/hiretrue/api/candidate/view?applicantPk="+ pk;
      return $http.get(url);
    };

    svc.auth = function (cb) {
      if (sessionStorage.e) {
        var url = 'rest/login/pax/eparam?e=' + sessionStorage.e;
        $http.get(url)
          .success(svc.successCb)
          .error(svc.errorCb);
      } else if (sessionStorage.login) {
        var login = JSON.parse(sessionStorage.login);
        svc.setupSessionStorage(login);
        cb(login);
      } else {
        return $location.path('/404');
      }
    };

    svc.authgmin = function (cb) {

      if (sessionStorage.e) {
        var url = 'rest/login/eparam?e=' + sessionStorage.e;
        $http.get(url)
          .success(svc.successCb)
          .error(svc.errorCb);
      } else if (sessionStorage.login) {
        var login = JSON.parse(sessionStorage.login);
        svc.setupSessionStorage(login);
        cb(login);
      } else {
        return $location.path('/404');
      }
    };

    svc.successCb = function (login) {
      sessionStorage.login = JSON.stringify(login);
      if (login.accessToken) {
        sessionStorage.removeItem("e");
        svc.setupSessionStorage(login);
      }
//      cb(JSON.parse(sessionStorage.login));
    };

    svc.errorCb = function (data, status, headers, config) {
      if (status === 0) {return;}
      var url = config.url;

      // Remove query string.
      var index = url.indexOf('?');
      if (index !== -1) {url = url.substring(0, index);}

      if (status === 403) {
        $location.path('/404');
      } else {
        var msg = status === 404 ? 'No service found at ' + url + '.' :
          status === 500 ? 'Error in service at ' + url + '.' : data;
          alert(msg);
      }
    };

    svc.setupSessionStorage = function(login) {
      sessionStorage.accessToken = login.accessToken;
      sessionStorage.sysUserName = login.sysUserName;
      sessionStorage.firstName = login.firstName === undefined ? login.fn:login.firstName;
      sessionStorage.lastName = login.lastName === undefined ? login.ln:login.lastName;
    };

    return svc;
  });

  //--------------------------------------------------------------------

  module.filter('emptyObject', function() {
    return function (obj) {
      return Object.keys(obj).length === 0;
    };
  });

  //--------------------------------------------------------------------

  module.filter('matchName', function() {
    return function(collectionObj, searchString) {
      if (searchString === undefined
        || collectionObj === undefined
        || searchString === null) {
        return collectionObj;
      }
      var splitSearch = searchString.split('&');
      if(splitSearch.length === 1) {
        return collectionObj.filter(function(obj) {
          return obj.name.toLowerCase().match(searchString.toLowerCase());
        });
      }
      return collectionObj.filter(function(obj) {
        if(obj[splitSearch[0]] !== null){
          return obj[splitSearch[0]].match(splitSearch[1]) && obj[splitSearch[0]].length === splitSearch[1].length;
        }
      });

    };
  });

  module.filter('unique', function() {
    return function(collection, keyname) {
      var output = [],
        keys = [];

      angular.forEach(collection, function(item) {
        var key = item[keyname];
        if(keys.indexOf(key) === -1) {
          keys.push(key);
          output.push(item);
        }
      });
      return keys;
    };
  });
})();
