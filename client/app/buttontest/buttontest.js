'use strict';

angular.module('doomieApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('buttontest', {
        url: '/buttontest',
        templateUrl: 'app/buttontest/buttontest.html',
        controller: 'ButtontestCtrl'
      });
  });