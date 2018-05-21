'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');
const config = require('../config');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');

const userModel = require('../backend/user/model.user');
const userController = require('../backend/user/controller.user');
const drawingController = require('../backend/drawing/controller.drawing');
const drawingModel = require('../backend/drawing/model.drawing');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedDrawingData() {
  console.info('seeding drawing data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      instruction: faker.lorem.sentence(),
      canvas: faker.lorem.sentence()
    });
  }
  // console.log(seedData, 'SEED')
  // this will return a promise
  return drawingModel.insertMany(seedData);
}

describe('Drawings API', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedDrawingData();
  });

  after(function() {
    return closeServer();
  });

  afterEach(function() {
    // userModel.remove({});
    tearDownDb();
  });

  describe(`Drawings API`, function() {
    it('should list drawings on GET', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, config.JWT_SECRET);

      return chai.request(app)
        .get(`/drawings/all/${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          console.log(res.body.instruction, 'instruction ONLY HERE')
          console.log(res.body, 'bodyONLY HERE')
          // expect(res.body.instruction).to.be.a('string');
          // expect(res.body.canvas).to.be.a('string');
          // expect(res.body.canvas.length).to.be.above(0);
          res.body.drawings.forEach(function(drawing) {
            console.log(Object.keys(drawing), 'drawing keys here')
            expect(drawing).to.be.a('object');
            expect(drawing).to.include.all.keys('id', 'instruction', 'canvas')
          });
          userModel.remove({});
        });
    });

    it('should add a drawing on POST', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, config.JWT_SECRET);

      const newDrawing = {
        instruction: faker.lorem.sentence(),
        canvas: faker.lorem.sentence(),
        userId: faker.lorem.sentence()
      };

      return chai.request(app)
        .post(`/drawings/create/${token}`)
        .send(newDrawing)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.instruction).to.equal(newDrawing.instruction);
        });
          userModel.remove({});
    });
    //
    it('should error if POST missing expected values', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, config.JWT_SECRET);

      const badRequestData = {};
      return chai.request(app)
        .post(`/drawings/create/${token}`)
        .send(badRequestData)
        .catch(function(res) {
          expect(res).to.have.status(400);
        });
          userModel.remove({});
    });
    //

//
    it('should delete posts on DELETE', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, config.JWT_SECRET);

      return chai.request(app)
        // first have to get
        .get(`/drawings/all/${token}`)
        .then(function(res) {

          return chai.request(app)
            .delete(`/drawings/delete/${res.body.drawings[0].id}/${token}`)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        });
          userModel.remove({});
    });


  });

});
