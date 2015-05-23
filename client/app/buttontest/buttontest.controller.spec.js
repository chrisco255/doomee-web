'use strict';

describe('Controller: ButtontestCtrl', function () {

  // load the controller's module
  beforeEach(module('doomieApp'));

  var ButtontestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ButtontestCtrl = $controller('ButtontestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
