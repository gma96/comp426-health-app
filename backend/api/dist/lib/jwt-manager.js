'use strict';

var JWT = require('jsonwebtoken');

var _require = require('../config/keys'),
    PUBLIC_KEY = _require.PUBLIC_KEY,
    PRIVATE_KEY = _require.PRIVATE_KEY;

var _require2 = require('../config/constants'),
    TOKEN_REVOKED = _require2.TOKEN_REVOKED;

var JWTManager = function () {
  var revoked = {};

  var _isRevoked = function _isRevoked(token) {
    return revoked[token] ? true : false;
  };

  var issue = function issue() {
    var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { expiresIn: undefined };

    if (opts.expiresIn === undefined) opts.expiresIn = 60 * 15;
    return JWT.sign(payload, PRIVATE_KEY, opts);
  };

  var _scrubPayload = function _scrubPayload(payload) {
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    return payload;
  };

  var verify = function verify(token) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Promise(function (resolve, reject) {
      // Is token revoked before expires?? If yes, they've been bad
      if (_isRevoked(token)) reject(TOKEN_REVOKED);

      // We've passed the first test, let's verify
      JWT.verify(token, PUBLIC_KEY, opts, function (e, decoded) {
        if (e) reject(e);
        resolve(decoded);
      });
    });
  };

  var refresh = function refresh(token) {
    var newPayload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var verification = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (!token) return false;
    return new Promise(function (resolve, reject) {
      verify(token, verify).then(function (payload) {
        // Succesfully verified, need to remove fields to be overwitten
        payload = _scrubPayload(payload);

        // Sign a new token for the request
        resolve(issue(Object.assign(payload, newPayload), opts, verification));
      }).catch(reject);
    });
  };

  var revoke = function revoke(token) {
    return new Promise(function (resolve, reject) {
      verify(token).then(function (decoded) {
        revoked[token] = decoded.exp;
        resolve(true);
      }).catch(reject);
    });
  };

  var _cleanUp = function _cleanUp() {
    var now = Date.now() / 1000;
    Object.keys(revoked).forEach(function (item, index, _array) {
      var expiration = revoked[item];
      if (expiration < now) {
        delete revoked[item];
      }
    });
  };

  setInterval(_cleanUp, 7000);

  return {
    issue: issue,
    revoke: revoke,
    verify: verify,
    refresh: refresh
  };
}();

// Export our manager
module.exports = JWTManager;