'use strict';
// Set Environment
process.env.NODE_ENV = 'test';
module.exports = {
  chai: require('chai'),
  db: require('../../models/index'),
  JWTManager: require('../../lib/jwt-manager'),
  catchLog: (e) => (e),
  user1: {
    'first_name': 'test',
    'last_name': 'user',
    'birthdate': '2017-10-27',
    'email': 'test@email.com',
    'password': 'test111111111',
    'height': 187,
    'unit': 'metric',
  },
  user2: {
    'first_name': 'test2',
    'last_name': 'user2',
    'birthdate': '2017-10-27',
    'email': 'test2@email.com',
    'password': 'test2222222222',
    'height': 187,
    'unit': 'imperial',
  },
};
