'use strict';

module.exports = function(app) {
  app.directive('dummyDirective', function() {
    return {
      restrict: 'A',
      template: '<p>{{someVal}}</p><input type="text" data-ng-model="someVal">',
      scope: {}
    }
  });
};
