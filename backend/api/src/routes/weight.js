// @flow
'use strict';
const _name:string = 'weight';
const controller:Object = require(`../controllers/${_name}`); // :( Flow no like
module.exports = (router: Object) => {
  router.route(`${_name}`)
    .get(controller.list)
    .post(controller.create);
  // Need to think about: should this be part of user path or own path???
  // /users/me/${name}/:_id?
  // we use me in the path because token provides user identity
  router.route(`${_name}/:_id`)
    .get(controller.read)
    .patch(controller.update)
    .delete(controller.delete);
};
