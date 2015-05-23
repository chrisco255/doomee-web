'use strict';

angular.module('doomieApp')
  .controller('ButtontestCtrl', function ($scope, $http, DButton, Task, $timeout) {
    $scope.dbuttons = DButton.query();
    $scope.tasks = Task.query(function() {
      _.each($scope.tasks, function(task) {
        var delay = _.first(task.frequencies).period;

        var startTimer = function() {
          $timeout(function() {
            console.log(task.name + " is now active");
            task.active = true;

            $timeout(function() {
              console.log(task.name + " is no longer active");
              task.active = false;
              startTimer();
            }, 1000);
          }, delay);
        };

        startTimer();
        console.log(task.frequencies[0].period);
      });
    });
  });
