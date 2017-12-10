// Require the dev-dependencies
const chai = require('chai');


// ***************************************************
// ** JWT STUFF                   **
// ***************************************************
const JWTManager = require('../../lib/jwt-manager');
process.env.NODE_ENV = 'test';
// ***************************************************
// ** END JWT STUFF                 **
// ***************************************************
const db = require('../../models/index');

// CHAI http lib
chai.use(require('chai-http'));
describe('Users', () => {
  let server = null;
  let request = null;
  before(() => {
    server = require('../../server');
    request = chai.request(server);
    // Delete all users from test
    db.user.destroy({
      where: {},
      truncate: true,
    });
  });

  after((done) => server.close(done));

  describe('/ POST', () => {
    let token;
    let user1 = {
      'first_name': 'test',
      'last_name': 'user',
      'birthdate': '2017-10-27',
      'email': 'test@email.com',
      'password': 'test',
      'height': 187,
      'unit': 'metric',
    };
    let user2 = {
      'first_name': 'test2',
      'last_name': 'user2',
      'birthdate': '2017-10-27',
      'email': 'test2@email.com',
      'password': 'test',
      'height': 187,
      'unit': 'imperial',
    };

    // Testing create
    describe('/api/v1/users', () => {
      it('creates a new user', (done) => {
        request
          .post('/api/v1/users')
          .send(user1)
          .end((err, res) => {
            res.should.have.status(200);
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
          }).catch();
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
            res.should.have.status(200);
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
          }).catch();
      });
    });
  });
});
