'use strict';
const axios = require('axios');

const Rest = (function() {
  const _routes = {};
  let _token = null;

  const _generateUri = function(uri, params) {
    for (let param in params) {
      if (params.hasOwnProperty(param)) {
        uri = uri.replace(new RegExp('\{' + param + '\}', 'i'), params[param]);
      }
    }
    return uri;
  };

  const _makeRequest = function(props) {
    // if (_token == null) {
    //   let token = Auth.getToken();
    //   if (token) _token = token;
    // }
    return function(data = {params: {}}) {
      let reqO = {
        method: props.method,
        url: _generateUri(props.absoluteUri, data.params),
      };
      if (_token) reqO.headers = {'Authorization': _token};
      if (data.data) reqO.data = data.data;
      if (data.query) reqO.params = data.query;
      return axios(reqO);
    };
  };

  const _viewRoutes = function() {
    return _routes;
  };

  const _setToken = function(token) {
    _token = 'Bearer ' + token;
    return true;
  };

  const _getToken = function() {
    return _token;
  };

  const _loadObject = function(o) {
    let layer = o;
    for (let resource in layer) {
      if (o.hasOwnProperty(resource)) {
        layer = o[resource];
        for (let route in layer) {
          if (layer.hasOwnProperty(route)) {
            _routes[resource] = _routes[resource] || {};
            _routes[resource][route] = _makeRequest(layer[route]);
          }
        }
      }
    }
  };

  return {
    load: _loadObject,
    viewRoutes: _viewRoutes,
    routes: _viewRoutes(),
    request: axios,
    setToken: _setToken,
    getToken: _getToken,
  };
})();

module.exports = Rest;
