// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
// Rest Requestor library
const Rest = require('./assets/rest');
// Load JS route definitions
const api_route_map = require('./assets/routes');
console.log(api_route_map);
// Load Routes
Rest.load(api_route_map);
window.Rest = Rest;

Vue.use(Vuex);
Vue.use(Vuetify, {
  theme: {
    primary: '#4776e6',
  }
});

const store = new Vuex.Store({
  state: {
    count: 0,
    isAuthed: true,
  },
  mutations: {
    increment (state) {
      state.count++
    },
    toggleAuth (state) {
      state.isAuthed = !state.isAuthed;
    }
  }
})

const EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  },
  $store: {
    get: function() {
      return store;
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
