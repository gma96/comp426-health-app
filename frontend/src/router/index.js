import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Mindfulness from '@/components/Mindfulness'
import Weight from '@/components/Weight'

Vue.use(Router);

export default new Router({
  routes: [
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
});
