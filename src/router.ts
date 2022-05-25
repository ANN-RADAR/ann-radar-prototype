import Vue from 'vue';
import Router, {Route} from 'vue-router';

import store from './store';

import Laboratories from './views/real-laboratories.vue';
import EditLaboratory from './components/laboratories-edit.vue';
import ListLaboratories from './components/laboratories-list.vue';
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

import {
  solarPotentialLayersOptions,
  energyPotentialLayersOptions,
  mobilityPotentialLayersOptions
} from './constants/layers';

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
        name: 'Solar Potential'
      },
      {
        path: 'solar/results',
        component: Results,
        name: 'Solar Potential Results',
        props: {
          category: 'solar',
          returnTo: '/potential/solar',
          thematicLayers: solarPotentialLayersOptions,
          thematicLayersTitleKey: 'layerOptions.solarLayers'
        }
      },
      {path: 'solar/*', redirect: '/potential/solar'},
      {
        path: 'energy-efficiency',
        component: EnergyPotential,
        name: 'Energy Potential'
      },
      {
        path: 'energy-efficiency/results',
        component: Results,
        name: 'Energy Potential Results',
        props: {
          category: 'energy-efficiency',
          returnTo: '/potential/energy-efficiency',
          thematicLayers: energyPotentialLayersOptions,
          thematicLayersTitleKey: 'layerOptions.energyLayers'
        }
      },
      {path: 'energy-efficiency/*', redirect: '/potential/energy-efficiency'},
      {
        path: 'mobility',
        component: null,
        name: 'Mobility Potential'
      },
      {
        path: 'mobility/results',
        component: Results,
        name: 'Mobility Potential Results',
        props: {
          category: 'mobility',
          returnTo: '/potential/mobility',
          thematicLayers: mobilityPotentialLayersOptions,
          thematicLayersTitleKey: 'layerOptions.mobilityLayers'
        }
      },
      {
        path: 'mobility/*',
        redirect: '/potential/mobility'
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
  {
    path: '/urban-testbeds/:laboratoryType',
    redirect: '/urban-testbeds/:laboratoryType/list',
    component: Laboratories,
    name: 'Urban Testbeds',
    children: [
      {
        path: 'list',
        component: ListLaboratories,
        name: 'List Urban Testbeds',
        props: (route: Route) => ({
          laboratoryType: route.params.laboratoryType,
          basePath: `/urban-testbeds/${route.params.laboratoryType}`
        })
      },
      {
        path: 'new',
        component: EditLaboratory,
        name: 'Add Urban Testbed',
        props: (route: Route) => ({
          laboratoryType: route.params.laboratoryType,
          returnTo: `/urban-testbeds/${route.params.laboratoryType}/list`
        })
      },
      {
        path: ':laboratoryId',
        component: EditLaboratory,
        name: 'Edit Urban Testbed',
        props: (route: Route) => ({
          laboratoryType: route.params.laboratoryType,
          laboratoryId: route.params.laboratoryId,
          returnTo: `/urban-testbeds/${route.params.laboratoryType}/list`
        })
      }
    ]
  },
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
