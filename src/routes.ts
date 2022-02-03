import Solar from './views/category-solar.vue';
import Energy from './views/category-energy.vue';

export default [
  { path: '/', redirect: '/solar' },
  { path: '/solar', component: Solar },
  { path: '/energy-efficency', component: Energy }
];
