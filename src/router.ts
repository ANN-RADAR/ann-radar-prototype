import Vue from 'vue';
import Router from 'vue-router';

import store from './store';

import Solar from './views/category-solar.vue';
import Energy from './views/category-energy.vue';
import Login from './views/app-login.vue';

const routes = [
  {path: '/', redirect: '/solar', name: 'Root'},
  {path: '/solar', component: Solar, name: 'Solar'},
  {path: '/energy-efficiency', component: Energy, name: 'Energy'},
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
