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
  Dbutton.create(req.body, function(err, dbutton) {
    if(err) { return handleError(res, err); }
    return res.json(201, dbutton);
  });
};

// Updates an existing dbutton in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Dbutton.findById(req.params.id, function (err, dbutton) {
    if (err) { return handleError(res, err); }
    if(!dbutton) { return res.send(404); }
    var updated = _.merge(dbutton, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, dbutton);
    });
  });
};

// Deletes a dbutton from the DB.
exports.destroy = function(req, res) {
  Dbutton.findById(req.params.id, function (err, dbutton) {
    if(err) { return handleError(res, err); }
    if(!dbutton) { return res.send(404); }
    dbutton.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}