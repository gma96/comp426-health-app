// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App';
import router from './router';
// Rest Requestor library
const Rest = require('./assets/rest');
const Auth = require('./assets/auth')('fjskak;flksdajklfjlksd;aj');
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
