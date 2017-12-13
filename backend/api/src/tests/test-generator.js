const generator = require('./payload-generator');
const shortid = require('shortid');

const getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

console.log(
  generator(10, {
    name: shortid,
    number: () => {
      return getRandomInt(10, 100);
    },
    email: () => {
      return `${shortid()}@${shortid()}.com`;
    },
  })
);
