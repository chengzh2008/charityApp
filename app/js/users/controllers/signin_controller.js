'use strict';

module.exports = function (app) {
    app.controller('signinController', ['$scope', '$rootScope', '$http', '$cookies', '$location', '$base64', function ($scope, $rootScope, $http, $cookies, $location, $base64) {
        $scope.signIn = function () {
            $http.defaults.headers.common['Authorization'] = 'Basic: ' + $base64.encode($scope.login.username + ':' + $scope.login.password);
            $http.get('/api/v1/sign_in')
                .error(function (data) {
                    console.log(data);
                })
                .success(function (data) {
                    $cookies.token = data.token;
                    $rootScope.currentUser = {
                        userId: data.userId,
                        userRole: data.userRole,
                        profileInfo: data.profileInfo
                    };
                    $location.path('/' + data.userRole + '/' + data.userId);
                });
        };
    }]);
};
