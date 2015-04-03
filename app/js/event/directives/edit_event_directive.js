'use strict';

module.exports = function(app) {
    app.directive('editEventDirective', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/event/directives/edit_event_directive.html',
            replace: true
        }
    });
};
