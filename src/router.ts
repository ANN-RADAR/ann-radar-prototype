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
import Results from './views/category-results.vue';
import Login from './views/app-login.vue';

const routes = [
  {path: '/', redirect: '/potential/solar', name: 'Root'},
  {
    path: '/potential',
    redirect: '/potential/solar',
    component: Potential,
    name: 'Potential',
    children: [
      {
        path: 'solar',
        component: SolarPotential,
        name: 'Solar Potential',
        children: [
          {
            path: 'results',
            component: Results,
            name: 'Solar Potential Results',
            props: {returnTo: '/potential/solar'}
          },
          {path: '*', redirect: '/potential/solar'}
        ]
      },
      {
        path: 'energy-efficiency',
        component: EnergyPotential,
        name: 'Energy Potential',
        children: [
          {
            path: 'results',
            component: Results,
            name: 'Energy Potential Results',
            props: {returnTo: '/potential/energy-efficiency'}
          },
          {path: '*', redirect: '/potential/energy-efficiency'}
        ]
      },
      {
        path: 'mobility',
        component: null,
        name: 'Mobility Potential',
        children: [
          {
            path: 'results',
            component: Results,
            name: 'Mobility Potential Results',
            props: {returnTo: '/potential/mobility'}
          },
          {path: '*', redirect: '/potential/mobility'}
        ]
      },
      {path: '*', redirect: '/potential/solar'}
    ]
  },
  {
    path: '/plans',
    redirect: '/plans/rate',
    component: Plans,
    name: 'Plans',
    children: [
      {path: 'rate', component: PlansRate, name: 'Rate Plans'},
      {path: 'compare', component: PlansCompare, name: 'Compare Plans'}
    ]
  },
  {
    path: '/stakeholders',
    redirect: '/stakeholders/rate',
    component: Stakeholders,
    name: 'Stakeholders',
    children: [
      {path: 'rate', component: StakeholdersRate, name: 'Rate Stakeholders'},
      {
        path: 'compare',
        component: StakeholdersCompare,
        name: 'Compare Stakeholders'
      }
    ]
  },
  {
    path: '/urban-data',
    redirect: '/urban-data/rate',
    component: UrbanData,
    name: 'Urban Data',
    children: [
      {path: 'rate', component: UrbanDataRate, name: 'Rate Urban Data'},
      {path: 'compare', component: UrbanDataCompare, name: 'Compare Urban Data'}
    ]
  },
  {
    path: '/governance',
    redirect: '/governance/rate',
    component: Governance,
    name: 'Governance',
    children: [
      {path: 'rate', component: GovernanceRate, name: 'Rate Governance'},
      {
        path: 'compare',
        component: GovernanceCompare,
        name: 'Compare Governance'
      }
    ]
  },
  {path: '/login', component: Login, name: 'Login'},
  {path: '*', redirect: '/'}
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
