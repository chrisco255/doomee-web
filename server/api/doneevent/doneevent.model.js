'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Task = require('../task/task.model');
var DButton = require('../dbutton/dbutton.model');

var DoneEventSchema = new Schema({
  taskId: { type: ObjectId, required: true },
  taskName: { type: String },
  dButtonId: ObjectId,
  time: { type: Date }
});

DoneEventSchema.pre('save', function(next) {
  var self = this;
  self.time = new Date();

  Task.findById(self.taskId, function(err, task) {
    if(err) { next(err); }
    if(!task) {
      err = new Error('Referenced task id not found');
      next(err);
    } else {
      self.taskName = task.name;
      next();
    }
  });
});

DoneEventSchema.path('dButtonId').validate(function (value, respond) {
  if(value) {
    DButton.count({ _id: value }, function (err, count) {
      if(err || !count) {
        respond(false);
      } else {
        respond(true);
      }
    });
  } else {
    respond(true);
  }
});

module.exports = mongoose.model('DoneEvent', DoneEventSchema);
