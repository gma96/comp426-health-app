// @flow
'use strict';
const chai = require('chai');
const should = require('chai').should();

// Testing Processing functions
const processes = require('../../lib/req-processors.js');
const testFields = {
  valid: [
    {
      req: ['_id', 'user_id', 'value'],
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: ['_id', 'user_id', 'value'],
    },
    {
      req: ['value', 'createdAt', 'UpDaTedAt'],
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: ['value', 'createdAt', 'updatedAt'],
    },
    {
      req: ['date', 'value'],
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: ['date', 'value'],
    },
  ],
  invalid: [
    {
      req: ['_id', 'user_id', 'random', 'rando'],
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: ['random', 'rando'],
    },
    {
      req: ['_id', 'user_id', 'VUILAOJE'],
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: ['VUILAOJE'],
    },
    {
      req: ['_id', 'user_id', 'rando'],
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: ['rando'],
    },
  ],
  blank: [
    {
      req: null,
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: null,
    },
    {
      req: null,
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: null,
    },
    {
      req: null,
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: null,
    },
    {
      req: null,
      def: ['_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt'],
      expected: null,
    },
  ],
};

describe('Process Fields', () => {
  testFields.valid.forEach((o) => {
    it('returns valid field array', (done) => {
      processes.fields('test', o.def, o.req.join(','))
        .then((fields) => {
          o.expected = o.expected.map((field:string) => {
            return field.toLowerCase();
          });
          fields.should.be.a('array');
          fields.should.eql(o.expected);
          done();
        })
        .catch((e) => {
          // .should.be.empty();
          chai.assert.fail(0, 1, 'Exception thrown');
          done();
        });
    });
  });

  testFields.invalid.forEach((o) => {
    it('returns invalid fields array', (done) => {
      processes.fields('test', o.def, o.req.join(','))
        .then((fields) => {
          chai.assert.fail(0, 1, 'Exception not thrown');
          done();
        })
        .catch((e) => {
          o.expected = o.expected.map((field:string) => {
            return field.toLowerCase();
          });
          e.values.should.be.a('array');
          e.values.should.eql(o.expected);
          done();
        });
    });
  });

  testFields.blank.forEach((o) => {
    it('returns null', (done) => {
      processes.fields('test', o.def, o.req)
        .then((fields) => {
          chai.assert(fields == o.expected, 'Expected null');
          done();
        })
        .catch((e) => {
          chai.assert.fail(0, 1, 'Exception thrown');
          done();
        });
    });
  });
});
