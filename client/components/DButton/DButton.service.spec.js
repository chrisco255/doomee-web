'use strict';

describe('Service: DButton', function () {

  // load the service's module
  beforeEach(module('doomieApp'));

  // instantiate service
  var DButton;
  beforeEach(inject(function (_DButton_) {
    DButton = _DButton_;
  }));

  it('should do something', function () {
    expect(!!DButton).toBe(true);
  });

});
