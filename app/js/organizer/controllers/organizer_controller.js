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
            ApiService.Organizer.edit($routeParams.userId, organizer)
                .success(function (data) {
                    $scope.edittingProfile = false;
                    $scope.currentUser.profileInfo = data;
                })
                .error(function () {
                    $location.path('/');
                });
        };

        $scope.cancel = function () {
            $scope.toggleEditProfile();
            $scope.getByUserId();
        };

        $scope.toggleEditProfile = function () {
            $scope.edittingProfile = !$scope.edittingProfile
        };

    }]);
};
