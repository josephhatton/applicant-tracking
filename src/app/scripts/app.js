'use strict';

var hiretrueApp = angular.module('hiretrueApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'pdf',
  'ui.bootstrap',
  'ang-drag-drop',
  'xeditable',
  'SharedModule',
  'ui.tinymce',
  'ngFileUpload'

])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});
