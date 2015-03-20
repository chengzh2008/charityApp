'use strict';

module.exports = function(app) {
  app.directive('createResourceDirective', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'templates/directives/resource_directive.html',
      scope: {
        save: '&',
        fieldname: '=',
        resourcename: '@'
      },
      controller: function($scope) {
        $scope.saveResource = function() {
          $scope.save({resource: $scope.resource});
          $scope.resource = null;
        };
      }
    }
  });
};
