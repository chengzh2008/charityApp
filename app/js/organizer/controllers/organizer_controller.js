'use strict';

module.exports = function (app) {
    app.controller('organizerController', ['$scope', 'ApiService', '$cookies', '$location', '$routeParams', function ($scope, ApiService, $cookies, $location, $routeParams) {

        if (!$cookies.token || $cookies.token.length < 1)
            $location.path('/signup');

        $scope.currentUser = {};
        $scope.edittingProfile = false;

        $scope.getByUserId = function () {
            ApiService.Organizer.getByUserId($routeParams.userId)
                .success(function (data, status) {
                    $scope.currentUser.profileInfo = data;
                })
                .error(function (data) {
                    $location.path('/');
                });
        };


        $scope.edit = function (organizer) {
            console.log(' update profile...method call');

            ApiService.Organizer.edit($routeParams.userId, organizer)
                .success(function (data) {
                    console.log('data from server', data);
                    $scope.edittingProfile = false;
                    $scope.currentUser.profileInfo = data;
                })
                .error(function () {
                    $location.path('/');
                });
        };

        $scope.remove = function (note) {
            ApiService.Organizer.remove(note, function () {
                $scope.notes.splice($scope.notes.indexOf(note), 1);
            });
        };

        $scope.toggleEditProfile = function () {
            if ($scope.edittingProfile) {
                $scope.edittingProfile = false;
            } else {
                $scope.edittingProfile = true;
            }
        };
    }]);
};
