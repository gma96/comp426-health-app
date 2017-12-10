// @flow
'use strict';
const _name:string = 'sleep';
const controller:Object = require(`../controllers/${_name}`); // :( Flow no like
module.exports = (router: Object) => {
  router.route(`${_name}`)
    .post(controller.create);
  // Need to think about: should this be part of user path or own path???
  // /users/me/${name}/:_id?
  // we use me in the path because token provides user identity
  router.route(`${_name}/:_id`)
    .get(controller.read)
    .patch(controller.update)
    .delete(controller.delete);
};