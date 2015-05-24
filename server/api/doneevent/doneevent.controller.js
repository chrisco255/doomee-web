'use strict';

var _ = require('lodash');
var DoneEvent = require('./doneevent.model');

// Get list of events
exports.index = function(req, res) {
  DoneEvent.find(function (err, events) {
    if(err) { return handleError(res, err); }
    return res.json(200, events);
  });
};

// Get a single event
exports.show = function(req, res) {
  DoneEvent.findById(req.params.id, function (err, event) {
    if(err) { return handleError(res, err); }
    if(!event) { return res.send(404); }
    return res.json(event);
  });
};

// Creates a new event in the DB.
exports.create = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DoneEvent.create(req.body, function(err, event) {
    if(err) { return handleError(res, err); }
    return res.json(201, event);
  });
};

function handleError(res, err) {
  return res.send(400, err);
}
