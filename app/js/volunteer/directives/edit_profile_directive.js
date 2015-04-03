'use strict';

module.exports = function(app) {
    app.directive('editProfileDirective', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/volunteer/directives/edit_profile_directive.html',
            replace: true
        }
    });
};
