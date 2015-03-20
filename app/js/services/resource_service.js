'use strict';

module.exports = function(app) {
  var handleSuccess = function(data) {
    this.callback(null, data);
  };

  var handleError = function(data) {
    this.callback(data);
  };

  app.factory('resource', ['$http', '$cookies', function($http, $cookies) {
    return function(resourceName) {
      $http.defaults.headers.common['token'] = $cookies.token;
      return {
        getAll: function(callback) {
          $http({
            method: 'GET',
            url: '/api/v1/' + resourceName
          })
          .success(callback)
          .error(function(data) {
            callback(data);
          });
        },

        getByUserId: function(userId, callback) {
          alert('about to get user by Id');
          $http({
            method: 'GET',
            url: '/api/v1/' + resourceName + '/' + userId
          }).success(callback)
              .error(callback);
        },

        get: function(resource, callback) {
          $http({
            method: 'GET',
            url: '/api/v1/' + resourceName + '/' + resource._id
          })
              .success(handleSuccess).bind({callback: callback})
              .error(function(data) {
                callback(data);
              });
        },

        create: function(resource, callback) {
          $http({
            method: 'POST',
            url: '/api/v1/' + resourceName,
            data: resource
          })
          .success(callback)
          .error(handleError);
        },

        save: function(resource, callback) {
          $http({
            method: 'PUT',
            url: '/api/v1/' + resourceName + '/' + resource._id,
            data: resource
          })
          .success(callback)
          .error(handleError);
        },

        remove: function(resource, callback) {
          $http({
            method: 'DELETE',
            url: '/api/v1/' + resourceName + '/' + resource._id
          })
          .success(callback)
          .error(handleError);
        }
      };
    };
  }]);
};
