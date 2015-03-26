'use strict';

module.exports = function(app) {
    app.directive('imageUploadDirective', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/users/directives/image_upload.html',
            replace: true
        }
    });
};
