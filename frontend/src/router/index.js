import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Mindfulness from '@/components/Mindfulness'
import Weight from '@/components/Weight'
import DashView from '@/components/DashView'
import LoginView from '@/components/LoginView'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login to MyHealth',
      component: LoginView,
    },
    {
      path: '/',
      component: DashView,
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
      ],
    },
  ],
});


