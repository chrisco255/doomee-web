'use strict';

angular.module('doomieApp')
  .factory('DButton', function ($resource) {
    return $resource('/api/dbuttons/:id', { id: '' },
      {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        }
      });
  });
