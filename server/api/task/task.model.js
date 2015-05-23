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
  name: String,
  frequencies: { type: [ FrequencySchema ], required: true }
});

module.exports = mongoose.model('Task', TaskSchema);
