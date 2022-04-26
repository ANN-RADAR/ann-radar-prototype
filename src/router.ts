import Vue from 'vue';
import Router from 'vue-router';

import store from './store';

import Potential from './views/category-potential.vue';
import SolarPotential from './components/solar-potential.vue';
import EnergyPotential from './components/energy-potential.vue';
import Plans from './views/category-plans.vue';
import PlansRate from './components/plans-rate.vue';
import PlansCompare from './components/plans-compare.vue';
import Stakeholders from './views/category-stakeholders.vue';
import StakeholdersRate from './components/stakeholders-rate.vue';
import StakeholdersCompare from './components/stakeholders-compare.vue';
import UrbanData from './views/category-urban-data.vue';
import UrbanDataRate from './components/urban-data-rate.vue';
import UrbanDataCompare from './components/urban-data-compare.vue';
import Governance from './views/category-governance.vue';
import GovernanceRate from './components/governance-rate.vue';
import GovernanceCompare from './components/governance-compare.vue';
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
      {path: 'rate', component: PlansRate, name: 'Rate'},
      {path: 'compare', component: PlansCompare, name: 'Compare'}
    ]
  },
  {
    path: '/stakeholders',
    redirect: '/stakeholders/rate',
    component: Stakeholders,
    name: 'Stakeholders',
    children: [
      {path: 'rate', component: StakeholdersRate, name: 'Rate'},
      {path: 'compare', component: StakeholdersCompare, name: 'Compare'}
    ]
  },
  {
    path: '/urban-data',
    redirect: '/urban-data/rate',
    component: UrbanData,
    name: 'Urban Data',
    children: [
      {path: 'rate', component: UrbanDataRate, name: 'Rate'},
      {path: 'compare', component: UrbanDataCompare, name: 'Compare'}
    ]
  },
  {
    path: '/governance',
    redirect: '/governance/rate',
    component: Governance,
    name: 'Governance',
    children: [
      {path: 'rate', component: GovernanceRate, name: 'Rate'},
      {path: 'compare', component: GovernanceCompare, name: 'Compare'}
    ]
  },
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
