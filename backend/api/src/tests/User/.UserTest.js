//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');

// ***************************************************
// ** JWT STUFF										**
// ***************************************************
const JWTManager = require('../../utils/JWTManager');
// Constants
const {
	TOKEN_RENEW_SUCCESS,
	TOKEN_ISSUE_SUCCESS,
	//USER_INCORRECT_LOGIN,
	TOKEN_LOGOUT_SUCCESS,
	TOKEN_BAD_REQUEST } = require('../../config/Constants');
// ***************************************************
// ** END JWT STUFF									**
// ***************************************************

chai.use(require('chai-http'));
//Our parent block
describe('Users', () => {
	let server = null;
	let request = null;
	before(() => {
		server = require('../../../server');
		request = chai.request(server);
	});

	// beforeEach((done) => { //Before each test we empty the database
	// User.remove({}, (err) => { 
	//   done();         
	// });     
	// });
	after(done => server.close(done));

	describe('/ POST', () => {
		let token;

		// Testing login
		describe('/login', () => {

			it('fails login request (no username)', (done) => {
				request
					.post('/users/login')
					.send({'password': 'leah'})
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						chai.assert.equal(TOKEN_BAD_REQUEST, res.body.message, `Message should: ${TOKEN_BAD_REQUEST}`);
						done();
					});
			});

			it('fails login request (no password)', (done) => {
				request
					.post('/users/login')
					.send({'username': 'preston'})
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						chai.assert.equal(TOKEN_BAD_REQUEST, res.body.message, `Message should: ${TOKEN_BAD_REQUEST}`);
						done();
					});
			});

			it('successful login request', (done) => {
				request
					.post('/users/login')
					.send({'username': 'preston', 'password': 'leah'})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						token = res.body.token;
						chai.assert.equal(TOKEN_ISSUE_SUCCESS, res.body.message, 'Message should: ');
						//res.body.length.should.be.eql(0);
						done();
					});
			});

			it('request has valid token from login', (done) => {
				JWTManager.verify(token)
					.then(decoded => {
						decoded.should.be.a('object');
						done();
					}).catch();
			});
		});

		// // testing logout
		describe('/refresh', () => {
			it('successful logout request', (done) => {
				request
					.post('/users/refresh')
					.set('Authorization', `Bearer ${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						token = res.body.token;
						chai.assert.equal(TOKEN_RENEW_SUCCESS, res.body.message, 'Message should: ');
						done();
					});
			});

			it('request has valid token from refresh', (done) => {
				JWTManager.verify(token)
					.then(decoded => {
						decoded.should.be.a('object');
						done();
					}).catch();
			});
		});

		// testing logout
		describe('/logout', () => {
			it('successful logout request', (done) => {
				request
					.post('/users/logout')
					.set('Authorization', `Bearer ${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						chai.assert.equal(TOKEN_LOGOUT_SUCCESS, res.body.message, 'Message should: ');
						done();
					});
			});
		});
	});
});

