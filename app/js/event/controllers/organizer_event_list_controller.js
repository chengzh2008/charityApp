'use strict';

module.exports = function (app) {
    app.controller('organizerEventListController', ['$scope', 'ApiService', '$cookies', '$location', '$routeParams', function ($scope, ApiService, $cookies, $location, $routeParams) {

        if (!$cookies.token || $cookies.token.length < 1)
            $location.path('/signup');

        $scope.eventList = [];
        $scope.newEvent = {};
        $scope.edittingEvent = false;
        $scope.addingEvent = false;
        $scope.showEvent = false;

        $scope.getAll = function () {
            ApiService.Event.getEventsByOrganizerId($routeParams.profileId)
                .success(function (data, status) {
                    $scope.eventList = data;
                })
                .error(function (data) {
                    $location.path('/');
                });
        };

        $scope.save = function (event) {
            event.organizerId = $routeParams.profileId;
            ApiService.Event.save(event)
                .success(function (data) {
                    console.log('after saved', data);
                    $scope.addingEvent = false;
                    $scope.eventList.push(data);
                })
                .error(function () {
                    $location.path('/');
                });
        };

        $scope.edit = function (event) {
            ApiService.Event.edit($routeParams.profileId, event)
                .success(function (data) {
                    $scope.edittingProfile = false;
                    //$scope.currentUser.profileInfo = data;
                    $location.path('/event/' + event._id);
                })
                .error(function () {
                    $location.path('/');
                });
        };

        $scope.remove = function (index) {
            ApiService.Event.remove($routeParams.profileId)
                .success(function (data) {
                    $scope.edittingProfile = false;
                    //$scope.currentUser.profileInfo = data;

                })
                .error(function () {
                    $location.path('/');
                });
        };

        $scope.cancel = function () {
            if ($scope.edittingEvent) {
                $scope.toggleEditEvent();
            } else {
                $scope.toggleAddEvent();
            }
        };

        $scope.toggleEditEvent = function () {
            $scope.edittingEvent = !$scope.edittingEvent;
        };

        $scope.toggleAddEvent = function () {
            $scope.addingEvent = !$scope.addingEvent;
        };

        $scope.toggleShowEvent = function () {
            $scope.showEvent = !$scope.showEvent;
        };

    }]);
};
