//const sinon = require('sinon');
const chai = require('chai');
var should = require('chai').should();

// even tho
should;

const JWTManager = require('../../lib/jwt-manager');
const { TOKEN_REVOKED } = require('../../config/constants');


const payloadGenerator = () => {
  let rando = () => {return Math.random() * 100000;};

  return {
    admin: rando(),
    role: rando(),
    a1: rando(),
    a2: rando(),
    expiresIn: Date.now() / 1000,
  }
}


const verifyWrapper = (token, current_payload, done) => {
  JWTManager.verify(token)
    .then(decoded => {
      chai.assert.equal(current_payload.admin, decoded.admin, 'Expects equivalent admin value');
      chai.assert.equal(current_payload.role, decoded.role, 'Expects equivalent role value');
      chai.assert.equal(current_payload.a1, decoded.a1, 'Expects equivalent a1 value');
      chai.assert.equal(current_payload.a2, decoded.a2, 'Expects equivalent a2 value');
      chai.assert.equal(true, decoded.exp >= current_payload.expiresIn, 'Expects expires to be within range');
      if(done) done();
    });
}

describe('Token Issuing', () => {
  it('Returns a valid token', (done) => {
    let current_payload = payloadGenerator();
    // Run through verify
    verifyWrapper(JWTManager.issue(current_payload), current_payload, done);
  });
});

describe('Token Revocation', () => {
  let current_payload = payloadGenerator();
  let issued_token = JWTManager.issue(current_payload);

  it('Returns a valid token', (done) => {
    verifyWrapper(issued_token, current_payload, done);
  });

  it('Successfully revokes token', () => {
    return JWTManager.revoke(issued_token).then(isRevoked => {
      chai.assert.equal(true, isRevoked, 'Expects true given revoke request');
    });
  });

  it('Successfully denies token', (done) => {
    JWTManager.verify(issued_token).catch(e => {
      chai.assert.equal(TOKEN_REVOKED, e, `Expects message: ${TOKEN_REVOKED}`);
      done();
    });
  });

});

describe('Token Refreshing', () => {
  let current_payload = payloadGenerator();
  let issued_token = JWTManager.issue(current_payload);

  it('Returns a valid token', (done) => {
    verifyWrapper(issued_token, current_payload, done);
  });

  it('Successfully re-issued token', (done) => {
    current_payload.expiresIn = Date.now() / 1000;
    setTimeout(() => {
      JWTManager.refresh(issued_token).then(newToken => {
        verifyWrapper(newToken, current_payload);
        chai.assert.notEqual(issued_token, newToken, '');
        done();
      });
    }, 1000);
  });

});
