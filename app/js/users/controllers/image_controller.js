'use strict';

module.exports = function (app) {

    $scope.onFileSelect = function(image) {
        if (angular.isArray(image)) {
            image = image[0];
        }

        // This is how I handle file types in client side
        if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
            alert('Only PNG and JPEG are accepted.');
            return;
        }

        $scope.uploadInProgress = true;
        $scope.uploadProgress = 0;

        $upload.upload({
            url: '/upload/image',
            method: 'POST',
            file: image
        }).progress(function(event) {
            $scope.uploadProgress = Math.floor(event.loaded / event.total);
            $scope.$apply();
        }).success(function(data, status, headers, config) {
            $scope.uploadInProgress = false;
            // If you need uploaded file immediately
            $scope.uploadedImage = JSON.parse(data);
        }).error(function(err) {
            $scope.uploadInProgress = false;
            console.log('Error uploading file: ' + err.message || err);
        });
    };




}