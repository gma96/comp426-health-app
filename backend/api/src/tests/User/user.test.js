'use strict';
const {chai, db, JWTManager, catchLog, user1, user2} = require('./user-setup');

// CHAI http lib
chai.use(require('chai-http'));
describe('Users', () => {
  let server = null;
  let request = null;
  before(function(done) {
    // Allow time for server to start
    this.timeout(5000);
    server = require('../../server');
    request = chai.request(server);
    // Delete all users from test
    db.user.destroy({
      where: {},
      truncate: true,
    });
    server.hookStart(done);
  });

  // test cleanup
  after((done) => server.close(done));

  let token;
  let user1Token;
  let user2Token;

  // ***************************************************
  // ** users/                                        **
  // ***************************************************
  describe('/api/v1/users', function() {
    this.timeout(5000);
    it('creates a new user', (done) => {
      request
        .post('/api/v1/users')
        .send(user1)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          token = res.body.data[0].token;
          done();
        });
    });

    it('request has valid token from create 1', (done) => {
      JWTManager.verify(token)
        .then((decoded) => {
          decoded.should.be.a('object');
          done();
        }).catch(catchLog);
    });

    it('deny create new user', (done) => {
      request
        .post('/api/v1/users')
        .send(user1)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
    it('creates a new user', (done) => {
      request
        .post('/api/v1/users')
        .send(user2)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          token = res.body.data[0].token;
          done();
        });
    });

    it('request has valid token from create 1', (done) => {
      JWTManager.verify(token)
        .then((decoded) => {
          decoded.should.be.a('object');
          done();
        }).catch(catchLog);
    });
  });

  // ***************************************************
  // ** users/login/                                  **
  // ***************************************************
  describe('/api/v1/users/login', () => {
    let routeContext = '/api/v1/users/login';
    it('login user User1', (done) => {
      request
        .post(routeContext)
        .send(user1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          token = res.body.data[0].token;
          user1Token = res.body.data[0].token;
          done();
        });
    });
    it('login has valid token User1', (done) => {
      JWTManager.verify(token)
        .then((decoded) => {
          decoded.should.be.a('object');
          decoded.email.should.eq(user1.email);
          done();
        }).catch(catchLog);
    });

    it('login user User2', (done) => {
      request
        .post(routeContext)
        .send(user2)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          token = res.body.data[0].token;
          user2Token = res.body.data[0].token;
          done();
        });
    });
    it('login has valid token User2', (done) => {
      JWTManager.verify(token)
        .then((decoded) => {
          decoded.should.be.a('object');
          decoded.email.should.eq(user2.email);
          done();
        }).catch(catchLog);
    });

    it('deny login User1', (done) => {
      request
        .post(routeContext)
        .send({
          email: user1.email,
          password: user2.password,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('deny login User2', (done) => {
      request
        .post(routeContext)
        .send({
          email: user2.email,
          password: user1.password,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  // ***************************************************
  // ** users/me/                                     **
  // ***************************************************
  describe('/api/v1/users/me', () => {
    let routeContext = '/api/v1/users/me';
    // Succesful profiles
    it('get User1 profile', (done) => {
      request
        .get(routeContext).set('Authorization', `Bearer ${user1Token}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          let user = Object.assign({}, user1);
          delete user.password;
          let body = Object.assign({}, res.body.data[0]);
          delete body.createdAt;
          delete body.updatedAt;
          delete body._id;
          body.should.be.eql(user);
          done();
        });
    });

    it('get User2 profile', (done) => {
      request
        .get(routeContext).set('Authorization', `Bearer ${user2Token}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          let user = Object.assign({}, user2);
          delete user.password;
          let body = Object.assign({}, res.body.data[0]);
          delete body.createdAt;
          delete body.updatedAt;
          delete body._id;
          body.should.be.eql(user);
          done();
        });
    });

    // Succesful delete
    it('delete User1', (done) => {
      request
        .delete(routeContext).set('Authorization', `Bearer ${user1Token}`)
        .send()
        .end((err, res) => {
          res.should.have.status(202);
          res.body.should.be.a('object');
          done();
        });
    });

    it('delete User2', (done) => {
      request
        .delete(routeContext).set('Authorization', `Bearer ${user2Token}`)
        .send()
        .end((err, res) => {
          res.should.have.status(202);
          res.body.should.be.a('object');
          done();
        });
    });

    // Failed delete
    it('fail to delete User1', (done) => {
      request
        .delete(routeContext).set('Authorization', `Bearer ${user1Token}`)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });

    it('fail to delete User2', (done) => {
      request
        .delete(routeContext).set('Authorization', `Bearer ${user2Token}`)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
