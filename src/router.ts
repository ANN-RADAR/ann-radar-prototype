import Vue from 'vue';
import Router, {Route} from 'vue-router';

import i18n from './plugins/i18n';

import store from './store';

import Laboratories from './views/real-laboratories.vue';
import EditLaboratory from './components/laboratories-edit.vue';
import ListLaboratories from './components/laboratories-list.vue';
import Category from './views/category-container.vue';
import PotentialInspectorTable from './components/potential-inspector-table.vue';
import Plans from './views/category-plans.vue';
import Stakeholders from './views/category-stakeholders.vue';
import StakeholdersEngagement from './components/stakeholders-engagement.vue';
import UrbanData from './views/category-urban-data.vue';
import Governance from './views/category-governance.vue';
import Results from './views/category-results.vue';
import Login from './views/app-login.vue';
import BalancedScorecardRate from './components/balanced-scorecard-rate.vue';
import BalancedScorecardCompare from './components/balanced-scorecard-compare.vue';

import {
  solarPotentialLayersOptions,
  energyPotentialLayersOptions,
  mobilityPotentialLayersOptions
} from './constants/layers';
import {ScorecardType} from './types/scorecards';
import {StakeholdersEngagementType} from './types/stakeholders';

const routes = [
  {path: '/', redirect: '/potential/solar', name: 'Root'},
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
  {
    path: '/potential/solar/results',
    component: Results,
    name: 'Solar Potential Results',
    props: {
      category: 'solar',
      returnTo: '/potential/solar',
      thematicLayers: solarPotentialLayersOptions,
      thematicLayersTitle: i18n.t('layerOptions.solarLayers')
    }
  },
  {
    path: '/potential/energy-efficiency/results',
    component: Results,
    name: 'Energy Potential Results',
    props: {
      category: 'energyEfficiency',
      returnTo: '/potential/energy-efficiency',
      thematicLayers: energyPotentialLayersOptions,
      thematicLayersTitle: i18n.t('layerOptions.energyLayers')
    }
  },
  {
    path: '/potential/mobility/results',
    component: Results,
    name: 'Mobility Potential Results',
    props: {
      category: 'mobility',
      returnTo: '/potential/mobility',
      thematicLayers: mobilityPotentialLayersOptions,
      thematicLayersTitle: i18n.t('layerOptions.mobilityLayers')
    }
  },
  {
    path: '*',
    component: Category,
    children: [
      {
        path: '/potential',
        redirect: '/potential/solar'
      },
      {
        path: '/potential/solar',
        components: {content: PotentialInspectorTable},
        name: 'Solar Potential',
        props: {
          content: {category: 'solar'}
        }
      },
      {path: 'solar/*', redirect: '/potential/solar'},
      {
        path: '/potential/energy-efficiency',
        components: {content: PotentialInspectorTable},
        name: 'Energy Potential',
        props: {
          content: {category: 'energyEfficiency'}
        }
      },
      {
        path: '/potential/energy-efficiency/*',
        redirect: '/potential/energy-efficiency'
      },
      {
        path: '/potential/mobility',
        components: {content: null},
        name: 'Mobility Potential'
      },
      {
        path: '/potential/mobility/*',
        redirect: '/potential/mobility'
      },
      {
        path: '/assessment/plans',
        redirect: '/assessment/plans/rate',
        name: 'Plans'
      },
      {
        path: '/assessment/plans/rate',
        components: {navigation: Plans, content: BalancedScorecardRate},
        name: 'Rate Plans',
        props: {
          content: {scorecardType: ScorecardType.PLANS}
        }
      },
      {
        path: '/assessment/plans/compare',
        components: {navigation: Plans, content: BalancedScorecardCompare},
        name: 'Compare Plans',
        props: {
          content: {scorecardType: ScorecardType.PLANS}
        }
      },
      {
        path: '/assessment/stakeholders-organizations',
        components: {content: StakeholdersEngagement},
        name: 'Stakeholders Organizations',
        props: {
          content: {
            stakeholdersEngagementType: StakeholdersEngagementType.ORGANIZATIONS
          }
        }
      },
      {
        path: '/assessment/stakeholders-citizens',
        components: {content: StakeholdersEngagement},
        name: 'Stakeholders Citizens',
        props: {
          content: {
            stakeholdersEngagementType: StakeholdersEngagementType.CITIZENS
          }
        }
      },
      {
        path: '/assessment/stakeholders/',
        redirect: '/assessment/stakeholders/rate',
        name: 'Stakeholders'
      },
      {
        path: '/assessment/stakeholders/rate',
        components: {navigation: Stakeholders, content: BalancedScorecardRate},
        name: 'Rate Stakeholders',
        props: {
          content: {scorecardType: ScorecardType.STAKEHOLDERS}
        }
      },
      {
        path: '/assessment/stakeholders/compare',
        components: {
          navigation: Stakeholders,
          content: BalancedScorecardCompare
        },
        name: 'Compare Stakeholders',
        props: {
          content: {scorecardType: ScorecardType.STAKEHOLDERS}
        }
      },
      {
        path: '/assessment/urban-data',
        redirect: '/assessment/urban-data/rate',
        name: 'Urban Data'
      },
      {
        path: '/assessment/urban-data/rate',
        components: {navigation: UrbanData, content: BalancedScorecardRate},
        name: 'Rate Urban Data',
        props: {content: {scorecardType: ScorecardType.URBAN_DATA}}
      },
      {
        path: '/assessment/urban-data/compare',
        components: {navigation: UrbanData, content: BalancedScorecardCompare},
        name: 'Compare Urban Data',
        props: {content: {scorecardType: ScorecardType.URBAN_DATA}}
      },
      {
        path: '/assessment/governance',
        redirect: '/assessment/governance/rate',
        name: 'Governance'
      },
      {
        path: '/assessment/governance/rate',
        components: {navigation: Governance, content: BalancedScorecardRate},
        name: 'Rate Governance',
        props: {content: {scorecardType: ScorecardType.GOVERNANCE}}
      },
      {
        path: '/assessment/governance/compare',
        components: {navigation: Governance, content: BalancedScorecardCompare},
        name: 'Compare Governance',
        props: {content: {scorecardType: ScorecardType.GOVERNANCE}}
      },
      {path: '*', redirect: '/'}
    ]
  }
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
