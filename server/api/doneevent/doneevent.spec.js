'use strict';

var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var app = require('../../app');
var request = require('supertest');
var mongoose = require('mongoose');
var _ = require('lodash');
var fixtures = require('mongoose-fixtures');
var ObjectId = mongoose.Types.ObjectId;

function DButtonBuilder(id, userId, taskId) {
  return {
    _id: id || ObjectId(),
    userId: userId,
    taskId: taskId
  };
}

function DoneEventBuilder(id, taskId) {
  return {
    _id: id || ObjectId(),
    taskId: taskId
  }
}

function TaskBuilder(id, taskName) {
  return {
    _id: id || ObjectId(),
    name: taskName || 'Task Name',
    frequencies: [{ period: 10 }]
  };
}

describe('DoneEvent Endpoint', function() {
  before(function (done) {
    var dButton_1 = DButtonBuilder(ObjectId('4edd40c86762e0fb12000003'));
    var dButton_2 = DButtonBuilder(ObjectId('4edd40c86762e0fb12000004'));

    var task_1 = TaskBuilder(ObjectId('4edd40c86762e0fb12000005'));

    var doneEvent_1 = DoneEventBuilder(ObjectId('4edd40c86762e0fb12000006'), ObjectId('4edd40c86762e0fb12000005'));

    var data = {
      DButton: [
        dButton_1,
        dButton_2
      ],
      Task: [
        task_1
      ],
      DoneEvent: [
        doneEvent_1
      ]
    };

    fixtures.load(data, done);
  });


  describe('GET /api/doneevents', function() {
    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/doneevents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          done();
        });
    });

    it('should contain 2 items in response', function (done) {
      request(app)
        .get('/api/doneevents')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.length(1);
          done();
        });
    });
  });

  describe('GET /api/doneevents/:id', function() {
    it('when id is valid should respond with the correct doneevent', function(done) {
      request(app)
        .get('/api/doneevents/4edd40c86762e0fb12000006')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body._id).to.equal('4edd40c86762e0fb12000006');
          done();
        });
    });

    it('when id is not found should return 404', function (done) {
      request(app)
        .get('/api/doneevents/4edd40c86762e0fb12000001')
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('when id is invalid should respond with error', function(done) {
      request(app)
        .get('/api/doneevents/asdfasdf')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe('POST /api/doneevents', function() {
    it('when task id is valid should create new doneevent', function(done) {
      var doneEvent = {
        taskId: '4edd40c86762e0fb12000005'
      };

      request(app)
        .post('/api/doneevents')
        .send(doneEvent)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.body._id).to.be.a('string');
          expect(res.body._id).to.not.be.empty;
          expect(res.body.taskId).to.equal('4edd40c86762e0fb12000005');
          expect(res.body.taskName).to.equal('Task Name');
          done();
        });
    });

    it('when request has defined an id, should ignore it', function(done) {
      var doneEvent = { _id: '4edd40c86762e0fb12000002', taskId: '4edd40c86762e0fb12000005' };

      request(app)
        .post('/api/doneevents')
        .send(doneEvent)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.body._id).to.be.a('string');
          expect(res.body._id).to.not.be.equal('4edd40c86762e0fb12000002');
          done();
        });
    });

    it('when task id is not found, should reject request', function(done) {
      var doneEvent = {
        taskId: '4edd40c86762e0fb12000002'
      };

      request(app)
        .post('/api/doneevents')
        .send(doneEvent)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when dbutton id is not found, should reject request', function(done) {
      var doneEvent = {
        taskId: '4edd40c86762e0fb12000005',
        dButtonId: '4edd40c86762e0fb12000001'
      };

      request(app)
        .post('/api/doneevents')
        .send(doneEvent)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when dbutton id and task id valid, saves data to doneevent', function(done) {
      var doneEvent = {
        taskId: '4edd40c86762e0fb12000005',
        dButtonId: '4edd40c86762e0fb12000003'
      };

      request(app)
        .post('/api/doneevents')
        .send(doneEvent)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.body.taskId).to.equal('4edd40c86762e0fb12000005');
          expect(res.body.dButtonId).to.equal('4edd40c86762e0fb12000003');
          done();
        });
    });

    it('when valid request, sets time', function(done) {
      var oldTime = new Date();

      var doneEvent = {
        taskId: '4edd40c86762e0fb12000005',
        dButtonId: '4edd40c86762e0fb12000003'
      };

      request(app)
        .post('/api/doneevents')
        .send(doneEvent)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          var time = new Date(res.body.time);
          expect(time).to.be.afterTime(oldTime);
          done();
        });
    });
  });
});



