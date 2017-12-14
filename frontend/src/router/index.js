import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Mindfulness from '@/components/views/Mindfulness'
import Settings from '@/components/views/Settings'
import Sleep from '@/components/views/Sleep'
import Weight from '@/components/Weight'
import DashView from '@/components/DashView'
import LoginView from '@/components/LoginView'
import SignUpView from '@/components/SignUpView'
import WaterIntake from '@/components/WaterIntake'


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
          name: 'My Dashboard',
          component: Dashboard,
        },
        {
          path: '/mindfulness',
          name: 'My Mindfulness',
          component: Mindfulness,
        },
        {
          path: '/weight',
          name: 'My Weight',
          component: Weight,
        },
        {
          path: '/Sleep',
          name: 'My Sleep',
          component: Sleep,
        },
        {
          path: '/settings',
          name: 'My Settings',
          component: Settings,
        },
        {
          path: '/water-intake',
          name: 'My Water Intake',
          component: WaterIntake,
        },
      ],
    },
    {
      path: '*',
      redirect: {name: 'Login to MyHealth'},
    },
  ],
});


