'use strict';

module.exports = function(app) {
  app.run(['$rootScope', '$cookies', function($rootScope, $cookies) {
    $rootScope.logOut = function() {
      $cookies.token = '';
    };

    $rootScope.loggedIn = function() {
      return !!$cookies.token;
    };
  }]);
  require('./controllers/signup_controller')(app);
  require('./controllers/signin_controller')(app);
};
