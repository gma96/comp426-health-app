// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App';
import router from './router';
// Rest Requestor library
const Rest = require('./assets/rest');
const Auth = require('./assets/auth')('-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs9zVFBmm7dQIhYKXyjWYnSLD91Un7s9pdU9+bQNloy/Usp/ivvypU4J62FdVCwvFENfkr0ZNuhYtqJY2Ou7ThfNAd5Rx9PyXx5P7NXAuWozNklTV8ndFhrpj/U22tthbTzZpR8d1iyBK8+6uaOYdzHbY3VyfbudGMv5OsiBEpPpIj1JKOp1zJjX7YNZFMFt2UVVVeX7t5YQT4JReAlWhp3TFq1J3M5MXLVZOIcl04Vc0hUqvmYOlpfg+U1cW6kGU2IwGIA9iyL+dprvJpprBHpQgrQaczRjwrmBt/mD4vAHgM1BcYRtW+TxW4Bqxv49RpdOGpI371pNba86A1a9g2wIDAQAB\n-----END PUBLIC KEY-----');
// Load JS route definitions
const apiRouteMap = require('./assets/routes');
// Load Routes
Rest.load(apiRouteMap);
// Window
window.Auth = Auth;
Rest.setToken(Auth.getToken());
window.Rest = Rest;


Vue.use(Vuetify, {
  theme: {
    primary: '#4776e6',
  },
});

const EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function() {
      return EventBus;
    },
  },
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
});
