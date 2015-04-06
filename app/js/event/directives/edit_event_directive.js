'use strict';

module.exports = function(app) {
    app.directive('editEventDirective', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/event/directives/edit_event_directive.html',
            replace: true,
            scope: {
                newEvent: '=newEvent',
                save: '&',
                cancel: '&'
            },
            controller: function ($scope) {
                $scope.saveEvent = function () {
                    console.log('test click save button');
                    $scope.save()($scope.newEvent);
                };
                $scope.cancelEvent = function () {
                    $scope.cancel()();
                }
            }
        }
    });
};
