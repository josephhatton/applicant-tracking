/**
 * Created by Joseph on 2/19/2015.
 */

"use strict";
hiretrueApp.animation(".fade", function() {
  return {
    addClass: function(element, className) {
      TweenMax.to(element, 1, {opacity: 0});
    },
    removeClass: function(element, className) {
      TweenMax.to(element, 1, {opacity: 1});
    }
  };
})
.directive("hideMe", function($animate) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.hideMe, function(newVal) {
      if (newVal) {
        $('#tablePane').css('width', '100%');
        $animate.addClass(element, "fade");
      } else {
        $('#tablePane').css('width', '66%');
        $animate.removeClass(element, "fade");
      }
    });
  };
})
.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
})
// /app/directives.js
.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    }
  }
]);