'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DbuttonSchema = new Schema({
  userId: ObjectId,
  taskId: ObjectId
});

module.exports = mongoose.model('Dbutton', DbuttonSchema);
