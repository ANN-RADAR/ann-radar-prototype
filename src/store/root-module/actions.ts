import {AdminLayerType} from '@/types/admin-layers';
import {
  ScorecardMeasureId,
  ScorecardRating,
  ScorecardType
} from '@/types/scorecards';
import {RootState, StoreState} from '@/types/store';
import {ActionContext} from 'vuex';

const scorecardURLs = {
  [ScorecardType.PLANS]:
    'https://storage.googleapis.com/ann-radar-data/plans_scorecard.json',
  [ScorecardType.STAKEHOLDERS]:
    'https://storage.googleapis.com/ann-radar-data/stakeholders_scorecard.json',
  [ScorecardType.URBAN_DATA]:
    'https://storage.googleapis.com/ann-radar-data/urban_data_scorecard.json',
  [ScorecardType.GOVERNANCE]:
    'https://storage.googleapis.com/ann-radar-data/governance_scorecard.json'
};

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
  fetchScorecard(
    {commit}: ActionContext<RootState, StoreState>,
    type: ScorecardType
  ) {
    return fetch(scorecardURLs[type])
      .then(response => response.json())
      .then(scorecard => {
        commit('setScorecard', {type, scorecard});
      })
      .catch(error => console.error(error));
  },
  fetchScorecardRatings(
    {commit}: ActionContext<RootState, StoreState>,
    type: ScorecardType
  ) {
    // TODO: get data from API
    commit('setScorecardRatings', {
      type,
      ratings: {
        [AdminLayerType.BOROUGH]: {
          Altona: {
            A1: {value: false, comment: 'A1 comment'},
            A2: {value: true},
            C1: {value: true},
            C2: {comment: 'C2 comment'}
          },
          Eimsbüttel: {
            A1: {value: true},
            B1: {value: true, comment: 'B1 comment'},
            C1: {value: true},
            C2: {value: false, comment: 'C2 comment'}
          },
          'Hamburg-Mitte': {
            A1: {value: true},
            C1: {value: false, comment: 'C1 comment'}
          },
          'Hamburg-Nord': {
            A1: {value: true, comment: 'A1 comment'},
            A2: {value: false, comment: 'A2 comment'},
            C1: {value: false}
          },
          Wandsbek: {
            A1: {value: true, comment: 'A1 comment'},
            C1: {value: false},
            C2: {value: true, comment: 'C2 comment'}
          }
        }
      }
    });
  },
  saveScorecardRatings(
    {commit, state}: ActionContext<RootState, StoreState>,
    payload: {
      scorecardType: ScorecardType;
      adminLayerType: AdminLayerType;
      featureId: string;
      measureId: ScorecardMeasureId;
      rating: ScorecardRating;
    }
  ) {
    const ratings = state.scorecardRatings[ScorecardType.PLANS];
    ratings[payload.adminLayerType] = ratings[payload.adminLayerType] || {};
    ratings[payload.adminLayerType][payload.featureId] =
      ratings[payload.adminLayerType][payload.featureId] || {};
    ratings[payload.adminLayerType][payload.featureId][payload.measureId] =
      payload.rating;

    // TODO: save in database
    commit('setScorecardRatings', {
      type: payload.scorecardType,
      ratings
    });
  }
};

export default actions;
