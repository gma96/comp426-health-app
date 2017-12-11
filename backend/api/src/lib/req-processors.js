// @flow
'use strict';
// NPM Modules
const _difference = require('lodash/difference');
const _intersection = require('lodash/intersection');
const ResourceFieldError = require('../exceptions/resource-field');

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
      _fields = _fields.map((field:string) => {
        return field.toLowerCase();
      });
      let difference = _difference(fields, _fields);
      // Check for difference or blank fields, short circuit difference
      // If empty value provided fail
      if (difference.length > 0) {
        // e.message = 'Invalid field values';
        // e.values = (_intersection(fields, ['']).length > 0) ? [] : difference;
        return reject(new ResourceFieldError(
          _path, 'Invalid field values',
          (_intersection(fields, ['']).length > 0) ? [] : difference
        ));
      }
      return resolve(fields);
    } else {
      return reject(new ResourceFieldError(
        _path, 'No field values provided, but field parameter present'
      ));
    }
  });
};

module.exports = processors;
