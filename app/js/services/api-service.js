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
                Volunteer: {
                    getByUserId: function (userId) {
                        return request(restUrl + '/volunteers/' + userId, 'GET');
                    },
                    edit: function (userId, organizer) {
                        return request(restUrl + '/volunteers/' + userId, 'PUT', organizer);
                    }
                },
                Event: {
                    getEventsByOrganizerId: function (profileId) {
                        return request(restUrl + '/events/organizer/' + profileId, 'GET');
                    },
                    getEventByEventId: function (eventId) {
                        return request(restUrl + '/events/byEventId/' + eventId, 'GET');
                    },
                    save: function (event) {
                        return request(restUrl + '/events/', 'POST', event);
                    },
                    edit: function (eventId, event) {
                        return request(restUrl + '/events/' + eventId, 'PUT', event);
                    },
                    remove: function (eventId) {
                        return request(restUrl + '/events/' + eventId, 'DELETE');
                    }
                }

            };
        }]);
};