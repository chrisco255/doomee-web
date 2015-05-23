'use strict';

var _ = require('lodash');
var Dbutton = require('./dbutton.model');

// Get list of dbuttons
exports.index = function(req, res) {
  Dbutton.find(function (err, dbuttons) {
    if(err) { return handleError(res, err); }
    return res.json(200, dbuttons);
  });
};

// Get a single dbutton
exports.show = function(req, res) {
  Dbutton.findById(req.params.id, function (err, dbutton) {
    if(err) { return handleError(res, err); }
    if(!dbutton) { return res.send(404); }
    return res.json(dbutton);
  });
};

// Creates a new dbutton in the DB.
exports.create = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Dbutton.create(req.body, function(err, dbutton) {
    if(err) { return handleError(res, err); }
    return res.json(201, dbutton);
  });
};

// Updates an existing dbutton in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  Dbutton.findById(req.params.id, function (err, dbutton) {
    if(err) { return handleError(res, err); }
    if(!dbutton) { return res.send(404); }

    var updatedDButton = _.merge(dbutton, req.body);
    updatedDButton.save(function (err) {
      if(err) { return handleError(res, err); }
      return res.json(200, updatedDButton);
    });
  });
};

function handleError(res, err) {
  return res.send(400, err);
}
