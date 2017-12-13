process.env.NODE_ENV = 'test';
// Test Suite
const chai = require('chai');
const should = require('chai').should();

// Generate resources function
const generator = require('../payload-generator');
const shortid = require('shortid');
const getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  //The maximum is exclusive and the minimum is inclusive
};
const pad = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const db = require('../../models/index');
const server = require('../../server');
chai.use(require('chai-http'));
const request = chai.request(server);

let _isServerReady = false;
server.hookStart(() => {
  _isServerReady = true;
});

const user = {
  'first_name': 'test',
  'last_name': 'user',
  'birthdate': '2017-10-27',
  'email': 'test@email.com',
  'password': 'test111111111',
  'height': 187,
  'unit': 'metric',
};

generator(100, {
  entry_date: () => {
    return `${getRandomInt(1000, 9000)}-${pad(getRandomInt(1, 12), 2)}-${pad(getRandomInt(1, 28), 2)}`;
  },
  value: () => {
    return getRandomInt(10, 100);
  },
}).then((resources) => {

  describe('Water Test', () => {
    let token = null;
    let createdIds = [];
    before(function(done) {
      this.timeout(5000);
      let where = {
        where: {},
      };
      // Generate dummy data
      Promise.all([
        db.water.destroy(where),
        db.user.destroy(where),
      ])
      .then((arr) => {
        let checkSever = () => {
          return setTimeout(() => {
            if (_isServerReady) done();
            else checkSever();
          }, 500);
        }
        checkSever();
      });
    });

    after(function(done) {
      let where = {
        where: {},
      };
      // Generate dummy data
      Promise.all([
        db.water.destroy(where),
        db.user.destroy(where),
      ])
      .then((arr) => {
        done()
      });
    });

    it('creates a new user', (done) => {
      request
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          token = res.body.data[0].token;
          done();
        });
    });

    resources.forEach(function(o) {
      it('creates water resource', function(done) {
          request
            .post('/api/v1/water')
            .set('Authorization', `Bearer ${token}`)
            .send(o)
            .then(res => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              let resource = res.body.data[0];
              createdIds.push(resource._id);
              done()
            })
            .catch(err => {
              console.error(err);
              false.should.eql(true);
              done()
            });
      });
    });

    resources.forEach(function(o) {
      it('fails to create an existing water resource', function(done) {
          request
            .post('/api/v1/water')
            .set('Authorization', `Bearer ${token}`)
            .send(o)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              done();
            });
      });
    });

    resources.forEach(function(o, i){
      it('checks created water resource', function(done) {
          request
            .get(`/api/v1/water/${createdIds[i]}`)
            .set('Authorization', `Bearer ${token}`)
            .send(o)
            .then(res => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              let resource = res.body.data[0];
              resource.entry_date.should.eql(o.entry_date);
              resource.value.should.eql(o.value);
              done()
            })
            .catch(err => {
              console.error(err);
              false.should.eql(true);
              done();
            });
      });
    });

    resources.forEach(function(o, i){
      it('denies update exists water resource', function(done) {
          o['value'] = 10;
          request
            .patch(`/api/v1/water/${createdIds[i]}`)
            .set('Authorization', `Bearer ${token}`)
            .send(o)
            .end((err, res) => {
              res.should.have.status(400);
              done();
            });
      });
    });

    resources.forEach(function(o, i){
      it('updates value water resource', function(done) {
          o['value'] = 10; // update object
          request
            .patch(`/api/v1/water/${createdIds[i]}`)
            .set('Authorization', `Bearer ${token}`)
            .send({value: o.value})
            .then(res => {
              res.should.have.status(202);
              done()
            })
            .catch(err => {
              console.error(err);
              false.should.eql(true);
              done();
            });
      });
    });

    resources.forEach(function(o, i){
      it('checks updated value water resource', function(done) {
          request
            .get(`/api/v1/water/${createdIds[i]}`)
            .set('Authorization', `Bearer ${token}`)
            .send(o)
            .then(res => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              let resource = res.body.data[0];
              resource.entry_date.should.eql(o.entry_date);
              resource.value.should.eql(10);
              done()
            })
            .catch(err => {
              console.error(err);
              false.should.eql(true);
              done();
            });
      });
    });

    resources.forEach(function(o, i) {
      it('deletes created water resource', function(done) {
          request
            .delete(`/api/v1/water/${createdIds[i]}`)
            .set('Authorization', `Bearer ${token}`)
            .send(o)
            .then(res => {
              res.should.have.status(202);
              done()
            })
            .catch(err => {
              console.error(err);
              false.should.eql(true);
              done();
            });
      });
    });

    createdIds.forEach(function(id) {
      it('fail to delete created water resource', function(done) {
          request
            .delete(`/api/v1/water/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(o)
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
      });
    });


  });
});