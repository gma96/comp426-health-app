'use strict';
const jwt = require('jsonwebtoken');
const Auth = function(publicKey) {
  const getToken = function() {
    return JSON.parse(localStorage.getItem('token'));
  };
  const storeToken = function(token) {
    return localStorage.setItem('token', JSON.stringify(token));
  };
  const destroyToken = function() {
    return localStorage.setItem('token', null);
  };
  const logout = function() {
    destroyToken();
    let local = location.hash;
    if (local != '#/signup') local = '#/login';
    return window.location = '/' + local;
  };
  // verify on load
  jwt.verify(getToken(), publicKey, function(e) {
    if (e) logout();
  });
  return {
    authed: function() {
      return new Promise(function(resolve, reject) {
        jwt.verify(getToken(), publicKey, function(e, decoded) {
          if (e) {
            console.log(e);
            if (e.name == 'TokenExpiredError') logout();
            return reject(false);
          }
          resolve({status: true, user:decoded});
        });
      });
    },
    decode: function(callback) {
      return jwt.verify(getToken(), publicKey, callback);
    },
    store: storeToken,
    logout: logout,
    getToken: getToken,
  };
};

module.exports = Auth;