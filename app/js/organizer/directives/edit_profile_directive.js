'use strict';

module.exports = function(app) {
    app.directive('editProfileDirective', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/organizer/directives/edit_profile_directive.html',
            replace: true
        }
    });
};
