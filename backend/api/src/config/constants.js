'use strict';
const tokens = {
  TOKEN_NULL: 'No Token Provided',
  TOKEN_BAD_REQ: 'Bad Request Token',
  TOKEN_VERIFY_FAILED: 'Failed to Verify Token',
  TOKEN_LOGOUT_SUCCESS: 'Logout Successful',
  TOKEN_ISSUE_SUCCESS: 'Authentication Successful',
  TOKEN_RENEW_SUCCESS: 'Renew Token Successful',
  TOKEN_EXPIRES: 15 * 6,
  TOKEN_REVOKED: 'Token has been revoked',
  TOKEN_NO_CREDENTIALS: 'No Credentials Provided',
  TOKEN_INVALID_CREDENTIALS: 'Usename or password incorrect.',
};

const users = {};
const errors = {};

module.exports = Object.assign({}, tokens, errors, users);
