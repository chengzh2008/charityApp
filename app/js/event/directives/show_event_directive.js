'use strict';

module.exports = function(app) {
    app.directive('showEventDirective', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/event/directives/single_event_directive.html',
            replace: true
        }
    });
};
