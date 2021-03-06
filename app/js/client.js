'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');

var helpOut = angular.module('helpOut', ['ngRoute', 'base64', 'ngCookies']);

require('./users/users')(helpOut);

//services
require('./services/resource_service')(helpOut);
require('./services/api-service')(helpOut);

//controllers
require('./organizer/controllers/organizer_controller')(helpOut);
require('./volunteer/controllers/volunteer_controller')(helpOut);
require('./event/controllers/organizer_event_list_controller')(helpOut);
require('./event/controllers/organizer_single_event_controller')(helpOut);


//directives
//require('./directives/dummy_directive')(helpOut);
//require('./directives/create_resource_directive')(helpOut);
require('./organizer/directives/edit_profile_directive')(helpOut);
require('./volunteer/directives/edit_volunteer_profile_directive')(helpOut);
require('./event/directives/edit_event_directive')(helpOut);
//require('./event/directives/show_event_directive')(helpOut);



helpOut.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/volunteer/:userId', {
            templateUrl: 'templates/volunteer/volunteer_welcome.html',
            controller: 'volunteerController'
        })
        .when('/organizer/:userId', {
            templateUrl: 'templates/organizer/organizer_welcome.html',
            controller: 'organizerController'
        })
        .when('/organizer/events/:profileId', {
            templateUrl: 'templates/event/organizer_event_list.html',
            controller: 'organizerEventListController'
        })
        .when('/organizer/byEventId/:eventId', {
            templateUrl: '../templates/event/organizer_single_event.html',
            controller: 'organizerSingleEventController'
        })
        .when('/about', {
            templateUrl: 'templates/about.html'
        })
        .when('/signup', {
            templateUrl: 'templates/users/signup.html',
            controller: 'signupController'
        })
        .when('/signin', {
            templateUrl: 'templates/users/signin.html',
            controller: 'signinController'
        })
        .when('/', {
            templateUrl: 'templates/landing_page.html'
        })
        .otherwise({
            templateUrl: 'templates/four_oh_four.html'
        })
}]);
