'use strict';

module.exports = function (app) {
    'use strict';

    app.service('ApiService', ['$http', '$cookies',
        function ($http, $cookies) {
            function request(route, method, data) {
                $http.defaults.headers.common['token'] = $cookies.token;
                var config = {
                    url: route,
                    method: method
                };
                if (data) {
                    config.data = data;
                }
                return $http(config);
            }

            var restUrl = '/api/v1';
            return {

                Organizer: {
                    getByUserId: function (userId) {
                        return request(restUrl + '/organizers/' + userId, 'GET');
                    },
                    edit: function (userId, organizer) {
                        return request(restUrl + '/organizers/' + userId, 'PUT', organizer);
                    }
                },
                Image: {
                    getImageById: function (userId) {
                        return request(restUrl + '/images/' + userId, 'GET');
                    }
                }
            };
        }]);
};