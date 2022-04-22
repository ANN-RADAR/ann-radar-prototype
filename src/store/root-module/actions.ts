import {AdminLayerType} from '@/types/admin-layers';
import {ScorecardMeasureId, ScorecardType} from '@/types/scorecards';
import {RootState, StoreState} from '@/types/store';
import {ActionContext} from 'vuex';

const actions = {
  fetchLayersConfig({commit}: ActionContext<RootState, StoreState>) {
    return fetch(
      'https://storage.googleapis.com/ann-radar-data/layers_config.json'
    )
      .then(response => response.json())
      .then(data => {
        commit('setLayersConfig', data);
      })
      .catch(error => console.error(error));
  },
  fetchPlansScorecard({commit}: ActionContext<RootState, StoreState>) {
    return fetch(
      'https://storage.googleapis.com/ann-radar-data/plans_scorecard.json'
    )
      .then(response => response.json())
      .then(scorecard => {
        commit('setScorecard', {type: ScorecardType.PLANS, scorecard});
      })
      .catch(error => console.error(error));
  },
  fetchPlansScorecardRatings({commit}: ActionContext<RootState, StoreState>) {
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
  },
  savePlansScorecardRatings(
    {commit, state}: ActionContext<RootState, StoreState>,
    payload: {
      adminLayerType: AdminLayerType;
      featureName: string;
      measureId: ScorecardMeasureId;
    }
  ) {
    const ratings = state.scorecardRatings[ScorecardType.PLANS];
    ratings[payload.adminLayerType] = ratings[payload.adminLayerType] || {};
    ratings[payload.adminLayerType][payload.featureName] =
      ratings[payload.adminLayerType][payload.featureName] || {};

    const previousValue =
      ratings[payload.adminLayerType][payload.featureName][payload.measureId];
    const nextValue =
      previousValue === true
        ? false
        : previousValue === false
        ? undefined
        : true;

    ratings[payload.adminLayerType][payload.featureName][payload.measureId] =
      nextValue;

    // TODO: save in database
    commit('setScorecardRatings', {
      type: ScorecardType.PLANS,
      ratings
    });
  }
};

export default actions;
