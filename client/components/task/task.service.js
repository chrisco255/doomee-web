'use strict';

angular.module('doomieApp')
  .factory('Task', function ($resource) {
    return $resource('/api/tasks/:id', { id: '' },
      {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        }
      });
  });
