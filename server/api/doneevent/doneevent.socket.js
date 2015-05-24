/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DoneEvent = require('./doneevent.model');

exports.register = function(socket) {
  DoneEvent.schema.post('save', function (doc) {
    onSave(socket, doc);
  });

  DoneEvent.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('doneevent:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('doneevent:remove', doc);
}
