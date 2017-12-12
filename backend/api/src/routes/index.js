/**
 * Import All Routes
 */
'use strict';
module.exports = (router) => {
  require('./user')(router);
  require('./water')(router);
  require('./weight')(router);
};
