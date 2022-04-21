import Vue from 'vue';
import Router from 'vue-router';

import store from './store';

import Potential from './views/category-potential.vue';
import SolarPotential from './components/solar-potential.vue';
import EnergyPotential from './components/energy-potential.vue';
import Plans from './views/category-plans.vue';
import Login from './views/app-login.vue';

const routes = [
  {path: '/', redirect: '/potential/solar', name: 'Root'},
  {
    path: '/potential',
    redirect: '/potential/solar',
    component: Potential,
    name: 'Potential',
    children: [
      {path: 'solar', component: SolarPotential, name: 'Solar'},
      {path: 'energy-efficiency', component: EnergyPotential, name: 'Energy'},
      {path: 'mobility', component: null, name: 'Mobility'}
    ]
  },
  {
    path: '/plans',
    redirect: '/plans/rate',
    component: Plans,
    name: 'Plans',
    children: [
      {path: 'rate', component: null, name: 'Rate'},
      {path: 'compare', component: null, name: 'Compare'}
    ]
  },
  {path: '/stakeholders', component: null, name: 'Stakeholders'},
  {path: '/urban-data', component: null, name: 'Urban Data'},
  {path: '/governance', component: null, name: 'Governance'},
  {path: '/login', component: Login, name: 'Login'}
];

Vue.use(Router);
const router = new Router({routes});

router.beforeEach(async (to, from, next) => {
  if (from === Router.START_LOCATION) {
    await store.dispatch('user/initializeStore');
  }

  if (!store.state.user.data && to.name !== 'Login') {
    next({name: 'Login'});
  } else if (store.state.user.data && to.name === 'Login') {
    next({name: 'Root'});
  }

  next();
});

export default router;
