'use strict';

module.exports = function(app) {
    app.directive('editVolunteerProfileDirective', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/volunteer/directives/edit_volunteer_profile_directive.html',
            replace: true
        }
    });
};
