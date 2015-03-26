'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');
require('ng-file-upload');

var helpOut = angular.module('helpOut', ['ngRoute', 'base64', 'ngCookies', 'angularFileUpload']);

require('./users/users')(helpOut);

//services
require('./services/resource_service')(helpOut);
require('./services/api-service')(helpOut);

//controllers
require('./organizer/controllers/organizer_controller')(helpOut);

//directives
//require('./directives/dummy_directive')(helpOut);
//require('./directives/create_resource_directive')(helpOut);
require('./organizer/directives/edit_profile_directive')(helpOut);
require('./users/directives/image_upload_directive')(helpOut);

helpOut.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/organizer/:userId', {
            templateUrl: 'templates/organizer/organizer_welcome.html',
            controller: 'organizerController'
        })
        .when('/volunteer/:useId', {
            templateUrl: 'templates/volunteer/volunteer_template.html',
            controller: 'volunteerController'
        })
        .when('/about', {
            templateUrl: 'templates/about.html'
        })
        .when('/signup', {
            templateUrl: 'templates/users/signup.html',
            controller: 'signupController'
        })
        .when('/', {
            redirectTo: '/signin'
        })
        .when('/signin', {
            templateUrl: 'templates/users/signin.html',
            controller: 'signinController'
        })
        .otherwise({
            templateUrl: 'templates/four_oh_four.html'
        })
}]);
