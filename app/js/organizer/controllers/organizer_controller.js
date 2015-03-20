'use strict';

module.exports = function (app) {
    app.controller('organizerController', ['$rootScope', '$scope', 'ApiService', '$cookies', '$location', '$routeParams', function ($rootScope, $scope, ApiService, $cookies, $location, $routeParams) {

        if (!$cookies.token || $cookies.token.length < 1)
            $location.path('/signup');

        $scope.currentUser = {};
        $scope.edittingProfile = false;
        console.log("current user", $scope.currentUser.userId);

        $scope.notes = [];

        $scope.getByUserId = function () {
            console.log('here is the front end method call... to get userprofile');
            ApiService.Organizer.getByUserId($routeParams.userId)
                .success(function (data, status) {
                    alert('front end come from database' + data.toString());
                    $scope.currentUser.profileInfo = data;
                })
                .error(function (data) {
                    console.log("fail to get info from backend");
                });
        };


        $scope.save = function (organizer) {
            ApiService.Organizer.save(organizer, function (err, data) {
                $scope.currentUser.profileInfo = data;
                $scope.edittingProfile = false;
            });
        };

        $scope.remove = function (note) {
            ApiService.Organizer.remove(note, function () {
                $scope.notes.splice($scope.notes.indexOf(note), 1);
            });
        };

        $scope.toggleEditProfile = function () {
            alert('testing...');
            if ($scope.edittingProfile) {
                $scope.edittingProfile = false;
            } else {
                $scope.edittingProfile = true;
            }
        };
    }]);
};
