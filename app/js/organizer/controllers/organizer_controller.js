'use strict';

module.exports = function (app) {
    app.controller('organizerController', ['$scope', 'ApiService', '$cookies', '$location', '$upload', '$routeParams', function ($scope, ApiService, $cookies, $location, $upload, $routeParams) {

        if (!$cookies.token || $cookies.token.length < 1)
            $location.path('/signup');

        $scope.currentUser = {};
        $scope.edittingProfile = false;
        $scope.pictureUrl = '/api/v1/images/' + $routeParams.userId;
        $scope.imageUploading = false;
        $scope.userImage = {};

        $scope.getByUserId = function () {
                    alert('successfully get image data');
            ApiService.Image.getImageById($routeParams.userId)
                .success(function (data) {
                    $scope.userImage.data = data.toString();
                    $scope.userImage.contentType = 'png'
                });
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
            $scope.edittingProfile = !$scope.edittingProfile
        };

        $scope.toggleImageUpload = function () {
            $scope.imageUploading = !$scope.imageUploading;
        };

        $scope.onFileSelect = function(image) {
            alert('testing...');
            if (angular.isArray(image)) {
                image = image[0];
            }

            if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
                alert('Only PNG and JPEG are accepted.');
                return;
            }

            $scope.uploadInProgress = true;
            $scope.uploadProgress = 0;

            $scope.upload = $upload.upload({
                url: '/upload/image',
                method: 'POST',
                file: image
            }).success(function(data, status, headers, config) {
                $scope.uploadedImage = JSON.parse(data);
                $location.path('/organizer/' + data.userId);
            }).error(function(err) {
                $scope.uploadInProgress = false;
                console.log('Error uploading file: ' + err.message || err);
            });
        };
    }]);
};
