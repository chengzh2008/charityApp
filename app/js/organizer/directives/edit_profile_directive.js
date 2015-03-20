'use strict';

module.exports = function(app) {
    app.directive('editprofileDirective', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/organizer/directives/edit_profile_directive.html',
            replace: true
        }
    });
};
