'use strict';
const AuthManager = function(verify) {
  let _isAuthed = false;
  let _user = null;
  let _token = null;

  function parseJwt(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
  };

  const _setLocalStorageIsAuthed = function() {
    localStorage.setItem('isAuthed', _isAuthed);
    return false;
  };

  const _setLocalStorageUser = function() {
    localStorage.setItem('user', JSON.stringify(_user));
    return false;
  };

  const _setLocalStorageToken = function() {
    localStorage.setItem('token', _token);
    return false;
  };

  const _getLocalStorageIsAuthed = function() {
    _isAuthed = localStorage.getItem('isAuthed');
    return _isAuthed;
  };

  const _getLocalStorageUser = function() {
    _user = JSON.parse(localStorage.getItem('user'));
    return _user;
  };

  const _getLocalStorageToken = function() {
    _token = JSON.parse(localStorage.getItem('token'));
    return _token;
  };

  const commit = function(o) {
    if (o.hasOwnProperty(isAuthed)) _isAuthed = o.isAuthed; 
    if (o.hasOwnProperty(user)) _user = o.user; 
    return {
      isAuthed: _isAuthed,
      user: _user,
    }
  };

  const setIsAuthed = function(bool) {
    if (bool === false) _isAuthed = false;
    else if (bool === true) _isAuthed = true;
    else {
      throw new Error('Unacceptable value passed, must be boolean');
      return false;
    }
    _setLocalStorageIsAuthed();
    return true;
  };

  const setUser = function(o) {
    if (o instanceof object) {
      if (o.hasOwnProperty('exp')) {
        _user = o;
        _setLocalStorageUser();
      } else {
        throw new Error('Unacceptable value passed, must have exp (expires)');
        return false;
      }
    } else {
      throw new Error('Unacceptable value passed, must be object');
      return false;
    }
    return true;
  };

  const _getUser = function() {
    if (_user == null) {
      if (!_getLocalStorageUser()) _user = null;
    }
    return _user;
  };

  const _getToken = function() {
    if (_token == null) {
      if (!_getLocalStorageToken()) _token = null;
    }
    return _token;
  };

  const _getIsAuthed = function() {
    if (_isAuthed == false) {
      if (!_getLocalStorageIsAuthed()) _isAuthed = false;
    }
    return _isAuthed;
  };

  const _destroyUser = function() {
    _user = null;
    _setLocalStorageUser();
  };

  const _isExpired = function() {
    if (_user) {
      let exp = _user.exp;
      if (Date.parse(exp) - Date.parse(new Date()) > 0) {
        return false;
      }
    }
    return true;
  };

  const _verifyToken = function(token) {
    alert(token);
    return new Promise(function(resolve, reject) {
      verify()
      .then(function(res) {
        setIsAuthed(true);
        setUser(parseJwt(token));
        _token = token;
        return resolve(true);
      })
      .catch(function(e) {
        alert(e);
        setIsAuthed(true);
        _destroyUser();
        return reject(false);
      });
    });
  };

    const _logout = function() {
      setIsAuthed(false);
      _destroyUser();
      window.history.pushState({path:'/login'});
    };

  if (localStorage) {
    _getLocalStorageUser();
    _getLocalStorageIsAuthed();
    _getLocalStorageToken();
    _verifyToken(_token);
  }

  setTimeout(function() {
    if (_isExpired()) {
      _destroyUser();
      setIsAuthed(false);
    };
  }, 2000);

  return {
    isAuthed: _getIsAuthed,
    user: _getUser,
    setToken: _verifyToken,
    logout: _logout,
  };
};

module.exports = AuthManager;
