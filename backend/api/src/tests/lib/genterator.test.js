// Test Suite
const chai = require('chai');
const should = require('chai').should();

// Generate objects function
const generator = require('../payload-generator');
const shortid = require('shortid');
const getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

let objects = [];

describe('Generator Test', () => {
  before((done) =>{
    // Generate dummy data
    generator(10000, {
      name: shortid,
      number: () => {
        return getRandomInt(10, 100);
      },
      email: () => {
        return `${shortid()}@${shortid()}.com`;
      },
    })
    .then((payload) => {
      objects = payload;
      done();
    });
  });

  it('check generated 10,000 objects', (done) => {
      objects.forEach((o, idx) => {
        o.should.eql(objects[idx]);
        o.name.should.be.a('string');
        o.number.should.be.a('number');
        o.email.should.be.a('string');
      });
      done();
  });
});