'use strict';

module.exports = function (app) {
    app.controller('organizerSingleEventController', ['$rootScope', '$scope', 'ApiService', '$cookies', '$location', '$routeParams', function ($rootScope, $scope, ApiService, $cookies, $location, $routeParams) {

        if (!$cookies.token || $cookies.token.length < 1)
            $location.path('/signup');

        $scope.event = {};
        $scope.newEvent = {};
        $scope.edittingEvent = false;

        $scope.getEvent = function () {
            ApiService.Event.getEventByEventId($routeParams.eventId)
                .success(function (data, status) {
                    $scope.event = data;
                })
                .error(function (data) {
                    $location.path('/');
                });
        };

        $scope.save = function (event) {
            ApiService.Event.edit(event._id, event)
                .success(function (data) {
                    $scope.edittingEvent = false;
                    //$scope.currentUser.profileInfo = data;
                    $location.path('/organizer/byEventId/' + event._id);
                })
                .error(function () {
                    $location.path('/');
                });
        };

        $scope.remove = function (eventId) {
            ApiService.Event.remove(eventId)
                .success(function (data) {
                    $scope.edittingEvent = false;
                    $location.path('/organizer/events/'+ $rootScope.currentUser.profileInfo._id);
                })
                .error(function () {
                    $location.path('/');
                });
        };

        $scope.cancel = function () {
                $scope.toggleEditEvent();
                //$location.path('/organizer/byEventId/' + $routeParams.eventId);
        };

        $scope.toggleEditEvent = function () {
            $scope.edittingEvent = !$scope.edittingEvent;
        };

    }]);
};
