// @flow
'use strict';
// NPM Modules
const _difference = require('lodash/difference');

const processors:Object = {};

// Field Processor
processors.fields = (_path:string, _fields:Array<string>, reqFields:string) => {
  return new Promise((resolve, reject) => {
    let fields:?Array<string> = reqFields.toLowerCase().split(',') || null;
    let e:Object = {
      type: 'ResourceFieldsError',
      dataPath: _path,
      message: 'No field values provided, but field parameter present',
    };
    if (fields) {
      let difference = _difference(fields, _fields);
      if (difference.length > 0) {
        e.message = 'Invalid field values';
        e.values = difference;
        return reject(e);
      }
      return resolve(fields);
    } else return reject(e);
  });
};

module.exports = processors;
