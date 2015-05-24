'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FrequencySchema = new Schema({
  startDT: { type: Date, default: Date.now },
  endDT: Date,
  anchorDT: Date,
  period: { type: Number, required: true }
});

var TaskSchema = new Schema({
  name: { type: String, required: true },
  frequencies: { type: [ FrequencySchema ], required: true }
});

TaskSchema.path('name').validate(function (value, respond) {
  if(value && value.trim()) {
    respond(true);
  } else {
    respond(false);
  }
});

module.exports = mongoose.model('Task', TaskSchema);
