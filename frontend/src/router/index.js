import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Mindfulness from '@/components/Mindfulness'
import Settings from '@/components/views/Settings'
import Weight from '@/components/Weight'
import DashView from '@/components/DashView'
import LoginView from '@/components/LoginView'
import SignUpView from '@/components/SignUpView'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login to MyHealth',
      component: LoginView,
      beforeEnter: function(to, from, next) {
        Auth.authed()
        .then(function(res) {
          console.log(res);
          next('/');
        })
        .catch(function(res) {
          next();
        });
      },
    },
    {
      path: '/signup',
      name: 'Sign up for MyHealth',
      component: SignUpView,
      beforeEnter: function(to, from, next) {
        Auth.authed()
        .then(function(res) {
          console.log(res);
          next('/');
        })
        .catch(function(res) {
          next();
        });
      },
    },
    {
      path: '/',
      component: DashView,
      beforeEnter: function(to, from, next) {
        Auth.authed()
        .then(function(res) {
          console.log(res);
          next();
        })
        .catch(function(res) {
          next('/login');
        });
      },
      children: [
        {
          path: '/',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: '/mindfulness',
          name: 'Mindfulness',
          component: Mindfulness,
        },
        {
          path: '/weight',
          name: 'Weight',
          component: Weight,
        },
        {
          path: '/settings',
          name: 'Your Settings',
          component: Settings,
        },
      ],
    },
    {
      path: '*',
      redirect: {name: 'Login to MyHealth'},
    },
  ],
});


