'use strict';

module.exports = function(app) {
  app.run(['$rootScope', '$cookies', '$location', function($rootScope, $cookies, $location) {
    $rootScope.logOut = function() {
      $cookies.token = '';
      $location.path('/');
    };

    $rootScope.loggedIn = function() {
      return !!$cookies.token;
    };
  }]);
  require('./controllers/signup_controller')(app);
  require('./controllers/signin_controller')(app);
};
