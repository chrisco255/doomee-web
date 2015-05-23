'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = require('../user/user.model');
var Task = require('../task/task.model');

var DButtonSchema = new Schema({
  userId: { type: ObjectId, ref: 'User' },
  taskId: { type: ObjectId, ref: 'Task' }
});

DButtonSchema.path('userId').validate(function (value, respond) {
  if(value) {
    User.count({ _id: value }, function (err, count) {
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

DButtonSchema.path('taskId').validate(function (value, respond) {
  if(value) {
    Task.count({ _id: value }, function (err, count) {
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

module.exports = mongoose.model('DButton', DButtonSchema);
