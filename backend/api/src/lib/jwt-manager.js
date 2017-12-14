'use strict';
const JWT = require('jsonwebtoken');
const {PUBLIC_KEY, PRIVATE_KEY, ALGO} = require('../config/keys');
const {TOKEN_REVOKED} = require('../config/constants');

const JWTManager = (() => {
  const revoked = {};

  const _isRevoked = (token) => {
    return revoked[token] ? true : false;
  };

  const issue = (payload={}, opts={expiresIn: undefined}) => {
    if (opts.expiresIn === undefined) opts.expiresIn = 60 * 15;
    return JWT.sign(payload, PRIVATE_KEY, Object.assign({}, opts, ALGO));
  };

  const _scrubPayload = (payload) => {
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    return payload;
  };

  const verify = (token, opts={}) => {
    return new Promise((resolve, reject) => {
      // Is token revoked before expires?? If yes, they've been bad
      if (_isRevoked(token)) reject(TOKEN_REVOKED);

      // We've passed the first test, let's verify
      JWT.verify(token, PUBLIC_KEY, opts, (e, decoded) => {
        if (e) reject(e);
        resolve(decoded);
      });
    });
  };

  const refresh = (token, newPayload={}, opts={}, verification={}) => {
    if (!token) return false;
    return new Promise((resolve, reject) => {
      verify(token, verify).then((payload) => {
        // Succesfully verified, need to remove fields to be overwitten
        payload = _scrubPayload(payload);

        // Sign a new token for the request
        resolve(issue(Object.assign(payload, newPayload), opts, verification));
      }).catch(reject);
    });
  };

  const refreshPreVer = (payload, newPayload={}, opts={}, verification={}) => {
    return new Promise((resolve, reject) => {
      if (!payload) reject({name: 'JsonWebToken', message: 'Payload Required'});
      payload = _scrubPayload(payload);
      // Sign a new token for the request
      resolve(issue(Object.assign(payload, newPayload), opts, verification));
    });
  };

  const revoke = (token) => {
    return new Promise((resolve, reject) => {
      verify(token).then((decoded) => {
        revoked[token] = decoded.exp;
        resolve(true);
      }).catch(reject);
    });
  };

  const _cleanUp = () => {
    let now = Date.now() / 1000;
    Object.keys(revoked).forEach((item, index, _array) => {
      const expiration = revoked[item];
      if (expiration < now) {
        delete revoked[item];
      }
    });
  };

  setInterval(_cleanUp, 7000);

  return {
    issue,
    revoke,
    verify,
    refresh,
    refreshPreVer,
  };
})();

// Export our manager
module.exports = JWTManager;
