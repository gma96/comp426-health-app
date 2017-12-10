'use strict';

//const sinon = require('sinon');
var chai = require('chai');
var should = require('chai').should();

// even tho
should;

var JWTManager = require('../../lib/jwt-manager');

var _require = require('../../config/constants'),
    TOKEN_REVOKED = _require.TOKEN_REVOKED;

var payloadGenerator = function payloadGenerator() {
  var rando = function rando() {
    return Math.random() * 100000;
  };

  return {
    admin: rando(),
    role: rando(),
    a1: rando(),
    a2: rando(),
    expiresIn: Date.now() / 1000
  };
};

var verifyWrapper = function verifyWrapper(token, current_payload, done) {
  JWTManager.verify(token).then(function (decoded) {
    chai.assert.equal(current_payload.admin, decoded.admin, 'Expects equivalent admin value');
    chai.assert.equal(current_payload.role, decoded.role, 'Expects equivalent role value');
    chai.assert.equal(current_payload.a1, decoded.a1, 'Expects equivalent a1 value');
    chai.assert.equal(current_payload.a2, decoded.a2, 'Expects equivalent a2 value');
    chai.assert.equal(true, decoded.exp >= current_payload.expiresIn, 'Expects expires to be within range');
    if (done) done();
  });
};

describe('Token Issuing', function () {
  it('Returns a valid token', function (done) {
    var current_payload = payloadGenerator();
    // Run through verify
    verifyWrapper(JWTManager.issue(current_payload), current_payload, done);
  });
});

describe('Token Revocation', function () {
  var current_payload = payloadGenerator();
  var issued_token = JWTManager.issue(current_payload);

  it('Returns a valid token', function (done) {
    verifyWrapper(issued_token, current_payload, done);
  });

  it('Successfully revokes token', function () {
    return JWTManager.revoke(issued_token).then(function (isRevoked) {
      chai.assert.equal(true, isRevoked, 'Expects true given revoke request');
    });
  });

  it('Successfully denies token', function (done) {
    JWTManager.verify(issued_token).catch(function (e) {
      chai.assert.equal(TOKEN_REVOKED, e, 'Expects message: ' + TOKEN_REVOKED);
      done();
    });
  });
});

describe('Token Refreshing', function () {
  var current_payload = payloadGenerator();
  var issued_token = JWTManager.issue(current_payload);

  it('Returns a valid token', function (done) {
    verifyWrapper(issued_token, current_payload, done);
  });

  it('Successfully re-issued token', function (done) {
    current_payload.expiresIn = Date.now() / 1000;
    setTimeout(function () {
      JWTManager.refresh(issued_token).then(function (newToken) {
        verifyWrapper(newToken, current_payload);
        chai.assert.notEqual(issued_token, newToken, '');
        done();
      });
    }, 1000);
  });
});