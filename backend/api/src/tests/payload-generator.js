// @flow
'use strict';
/**
 * generator function
 * @param  {integer} n:number number of desired objects
 * @param  {Object}  o:Object what the object is supposed to look like
 * @return {Array}            Array of generated objects
 */
module.exports = function(n:number, o:Object):Array<Object> {
  return new Promise((resolve, reject) => {
    if (typeof n != 'number') return reject(new Error('N must be int'));
    if (typeof o != 'object') return reject(new Error('O must be object'));
    let generated = [];
    for (let i = n; i > 0; i--) {
      let generatedObject = {};
      for (const prop in o) {
        if (o.hasOwnProperty(prop)) {
          generatedObject[prop] = o[prop]();
        }
      }
      generated.push(generatedObject);
    }
    return resolve(generated);
  });
};
