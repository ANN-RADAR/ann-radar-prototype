import {AdminLayerType} from '@/types/admin-layers';
import {ScorecardType} from '@/types/scorecards';
import {RootState, StoreState} from '@/types/store';
import {ActionTree} from 'vuex';

const actions: ActionTree<RootState, StoreState> = {
  fetchLayersConfig({commit}) {
    return fetch(
      'https://storage.googleapis.com/ann-radar-data/layers_config.json'
    )
      .then(response => response.json())
      .then(data => {
        commit('setLayersConfig', data);
      })
      .catch(error => console.error(error));
  },
  fetchPlansScorecard({commit}) {
    return fetch(
      'https://storage.googleapis.com/ann-radar-data/plans_scorecard.json'
    )
      .then(response => response.json())
      .then(scorecard => {
        commit('setScorecard', {type: ScorecardType.PLANS, scorecard});
      })
      .catch(error => console.error(error));
  },
  fetchPlansScorecardRatings({commit}) {
    // TODO: get data from API
    commit('setScorecardRatings', {
      type: ScorecardType.PLANS,
      ratings: {
        [AdminLayerType.BOROUGH]: {
          Altona: {A1: false, A2: true, C1: true},
          Eimsbüttel: {A1: true, B1: true, C1: true, C2: false},
          'Hamburg-Mitte': {A1: true, C1: false}
        }
      }
    });
  }
};

export default actions;
