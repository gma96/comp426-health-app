'use strict';
const jwt = require('jsonwebtoken');
const Auth = function(publicKey) {
  let _trigger = null;
  const expired = function() {
    let token = getToken();
    if (!token) return true; 
    return jwt.decode(token, publicKey).exp * 1000 < Date.now();
  };
  const trigger = (function() {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            // do something
            return setTimeout(function() {
              if (expired()) logout();
            }, 10000);
        }
    };
  })();
  const getToken = function() {
    return JSON.parse(localStorage.getItem('token'));
  };
  const storeToken = function(token) {
    _trigger = trigger();
    return localStorage.setItem('token', JSON.stringify(token));
  };
  const destroyToken = function() {
    clearTimeout(_trigger);
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
          resolve({status: true, user: decoded});
        });
      });
    },
    decode: function() {
      return jwt.decode(getToken(), publicKey);
    },
    store: storeToken,
    logout: logout,
    getToken: getToken,
  };
};

module.exports = Auth;
