'use strict';

module.exports = function (app) {


    app.controller('signupController', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
        $scope.createNewUser = function () {
            var role = $scope.newUser.role;
            var url = role === 'volunteer' ? '/api/v1/create_user_volunteer' : '/api/v1/create_user_organizer';

            $http({
                method: 'POST',
                url: url,
                data: {credential: $scope.newUser}
            })
                .error(function (data) {
                    console.log(data);
                    $location.path('/');
                })
                .success(function (data) {
                    $cookies.token = data.token;

                    if (role === 'volunteer') {
                        $location.path('/volunteer/' + data.userId);
                    } else {
                        $location.path('/organizer/' + data.userId);
                    }
                });
        };
    }]);
};
