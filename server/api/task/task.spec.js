'use strict';

var expect = require('chai').expect;
var app = require('../../app');
var request = require('supertest');
var mongoose = require('mongoose');
var _ = require('lodash');
var fixtures = require('mongoose-fixtures');
var ObjectId = mongoose.Types.ObjectId;

function TaskBuilder(id, taskName) {
  return {
    _id: id || ObjectId(),
    name: taskName || 'Task name',
    frequencies: [{ period: 10 }]
  };
}

describe('Task Endpoint', function() {
  before(function (done) {
    var task_1 = TaskBuilder(ObjectId('4edd40c86762e0fb12000008'));
    var task_2 = TaskBuilder(ObjectId('4edd40c86762e0fb12000009'));
    var task_3 = TaskBuilder(ObjectId('4edd40c86762e0fb12000010'));

    var data = {
      Task: [
        task_1,
        task_2,
        task_3
      ]
    };

    fixtures.load(data, done);
  });

  describe('GET /api/tasks', function() {
    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });

    it('should contain three items in response', function(done) {
      request(app)
        .get('/api/tasks')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.length(3);
          done();
        });
    });
  });

  describe('GET /api/tasks/:id', function() {
    it('when id is valid should respond with the correct task', function(done) {
      request(app)
        .get('/api/tasks/4edd40c86762e0fb12000008')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body._id).to.equal('4edd40c86762e0fb12000008');
          done();
        });
    });

    it('when id is not found should return 404', function (done) {
      request(app)
        .get('/api/tasks/4edd40c86762e0fb12000001')
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('when id is invalid should respond with error', function(done) {
      request(app)
        .get('/api/tasks/asdfasdf')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe('POST /api/tasks', function() {
    it('when no name or frequency list provided, returns error', function(done) {
      var task = {};

      request(app)
        .post('/api/tasks')
        .send(task)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it('when request has defined an id, should ignore it', function(done) {
      var task = { _id: '4edd40c86762e0fb12000002', name: 'Task 2', frequencies: [{ period: 10 }] };

      request(app)
        .post('/api/tasks')
        .send(task)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.body._id).to.be.a('string');
          expect(res.body._id).to.not.be.equal('4edd40c86762e0fb12000002');
          done();
        });
    });

    it('when task name is an empty string should reject request', function(done) {
      var task = { name: '', frequencies: [{ period: 10 }] };

      request(app)
        .post('/api/tasks')
        .send(task)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when task name is valid, should save request', function(done) {
      var task = { name: 'Task', frequencies: [{ period: 10 }] };

      request(app)
        .post('/api/tasks')
        .send(task)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal('Task');
          expect(res.body.frequencies).to.be.length(1);
          done();
        });
    });

  });

  describe('PUT /api/tasks/:id', function() {
    it('when task is not found, should return not found', function(done) {
      var task = {};

      request(app)
        .put('/api/tasks/4edd40c86762e0fb12000002')
        .send(task)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it('when name provided is empty, should reject request', function(done) {
      var task = { name: '' };

      request(app)
        .put('/api/tasks/4edd40c86762e0fb12000008')
        .send(task)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when id is invalid should return bad request', function(done) {
      var task = { name: 'ad', frequencies: [{ period: 10 }] };

      request(app)
        .put('/api/tasks/aseff')
        .send(task)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when new data is valid, should save request', function(done) {
      var task = { name: 'NewTask', frequencies: [{ period: 10 }, { period: 5 }] };

      request(app)
        .put('/api/tasks/4edd40c86762e0fb12000009')
        .send(task)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('NewTask');
          expect(res.body.frequencies).to.be.length(2);
          done();
        });
    });

  });

  describe('DELETE /api/tasks/:id', function() {
    it('when task is not found, should return not found', function(done) {
      var task = {};

      request(app)
        .delete('/api/tasks/4edd40c86762e0fb12000002')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it('when id is valid and exists in collection, should delete task', function(done) {
      var task = { name: '' };

      request(app)
        .delete('/api/tasks/4edd40c86762e0fb12000008')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(204);

          request(app)
            .get('/api/tasks/4edd40c86762e0fb12000008')
            .end(function(err, res) {
              if (err) return done(err);
              expect(res.status).to.equal(404);
              done();
            });
        });
    });
  });
});
