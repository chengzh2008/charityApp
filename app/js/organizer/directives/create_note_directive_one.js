'use strict';

module.exports = function(app) {
  app.directive('createNoteDirective', function() {
    return {
      restrict: 'A',
      templateUrl: '/templates/notes/directives/create_note_directive.html',
      replace: true
    }
  });
};
