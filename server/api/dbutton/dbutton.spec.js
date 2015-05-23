'use strict';

var expect = require('chai').expect;
var app = require('../../app');
var request = require('supertest');
var DButton = require('./dbutton.model');
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

function UserBuilder(id) {
  return {
    _id: id || ObjectId(),
    email: 'user@user.com',
    password: 'abc123'
  };
}

function TaskBuilder(id) {
  return {
    _id: id || ObjectId(),
    frequencies: [{ period: 10 }]
  };
}

describe('DButton Controller', function() {
  before(function (done) {
    var dButton_1 = DButtonBuilder(ObjectId('4edd40c86762e0fb12000003'));
    var dButton_2 = DButtonBuilder(ObjectId('4edd40c86762e0fb12000004'));

    var task_1 = TaskBuilder(ObjectId('4edd40c86762e0fb12000005'));
    var user_1 = UserBuilder(ObjectId('4edd40c86762e0fb12000006'));

    var data = {
      DButton: [
        dButton_1,
        dButton_2
      ],
      Task: [
        task_1
      ],
      User: [
        user_1
      ]
    };

    fixtures.load(data, done);
  });

  describe('GET /api/dbuttons', function() {
    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/dbuttons')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          done();
        });
    });

    it('should contain 2 items in response', function (done) {
      request(app)
        .get('/api/dbuttons')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.length(2);
          done();
        });
    });
  });

  describe('GET /api/dbuttons/:id', function() {
    it('when id is valid should respond with the correct dbutton', function(done) {
      request(app)
        .get('/api/dbuttons/4edd40c86762e0fb12000003')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body._id).to.equal('4edd40c86762e0fb12000003');
          done();
        });
    });

    it('when id is not found should return 404', function (done) {
      request(app)
        .get('/api/dbuttons/4edd40c86762e0fb12000001')
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('when id is invalid should respond with error', function(done) {
      request(app)
        .get('/api/dbuttons/asdfasdf')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe('POST /api/dbuttons', function() {
    it('when request is empty should create new dbutton', function(done) {
      request(app)
        .post('/api/dbuttons')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body._id).to.be.a('string');
          expect(res.body._id).to.not.be.empty;
          done();
        });
    });

    it('when request has defined an id, should ignore it', function(done) {
      var dButton = { _id: '4edd40c86762e0fb12000002' };

      request(app)
        .post('/api/dbuttons')
        .send(dButton)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body._id).to.be.a('string');
          expect(res.body._id).to.not.be.equal('4edd40c86762e0fb12000002');
          done();
        });
    });

    it('when user id is not found, should reject request', function(done) {
      var dButton = {
        userId: '4edd40c86762e0fb12000002'
      };

      request(app)
        .post('/api/dbuttons')
        .send(dButton)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when task id is not found, should reject request', function(done) {
      var dButton = {
        taskId: '4edd40c86762e0fb12000002'
      };

      request(app)
        .post('/api/dbuttons')
        .send(dButton)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when task and user id are valid, saves to new dbutton', function(done) {
      var dButton = {
        taskId: '4edd40c86762e0fb12000005',
        userId: '4edd40c86762e0fb12000006'
      };

      request(app)
        .post('/api/dbuttons')
        .send(dButton)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.body.taskId).to.equal('4edd40c86762e0fb12000005');
          expect(res.body.userId).to.equal('4edd40c86762e0fb12000006');
          done();
        });
    });
  });

  describe('PUT /api/dbuttons/:id', function() {
    it('when dbutton id is not found, should return not found', function(done) {
      var dButton = {};

      request(app)
        .put('/api/dbuttons/4edd40c86762e0fb12000000')
        .send(dButton)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('when dbutton id is invalid, should return bad request', function(done) {
      var dButton = {};

      request(app)
        .put('/api/dbuttons/asdfa')
        .send(dButton)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when task id is not found, should return bad request', function(done) {
      var dButton = {
        taskId: '4edd40c86762e0fb12000006'
      };

      request(app)
        .put('/api/dbuttons/4edd40c86762e0fb12000003')
        .send(dButton)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('when new data is valid, should properly save', function(done) {
      var dButton = {
        taskId: '4edd40c86762e0fb12000005',
        userId: '4edd40c86762e0fb12000006'
      };

      request(app)
        .put('/api/dbuttons/4edd40c86762e0fb12000003')
        .send(dButton)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.taskId).to.equal('4edd40c86762e0fb12000005');
          done();
        });
    });
  });
});

