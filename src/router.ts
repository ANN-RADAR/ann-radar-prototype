import Vue from 'vue';
import Router from 'vue-router';

import store from './store';

import Solar from './views/category-solar.vue';
import Energy from './views/category-energy.vue';
import Login from './views/app-login.vue';

const routes = [
  {path: '/', redirect: '/solar'},
  {path: '/solar', component: Solar, name: 'Solar'},
  {path: '/energy-efficency', component: Energy, name: 'Energy'},
  {path: '/login', component: Login, name: 'Login'}
];

Vue.use(Router);
const router = new Router({routes});

router.beforeEach((to, from, next) => {
  if (!store.state.user.loggedIn && to.name !== 'Login') {
    next({name: 'Login'});
  }
  next();
});

export default router;
