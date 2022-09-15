import {AdminLayerType} from '@/types/admin-layers';
import {
  ScorecardMeasureId,
  ScorecardRating,
  ScorecardType
} from '@/types/scorecards';
import {RootState, StoreState} from '@/types/store';
import {Scenario} from '@/types/scenarios';
import {Laboratory, LaboratoryId} from '@/types/laboratories';
import {
  StakeholdersEngagementMeasureId,
  StakeholdersEngagementRating,
  StakeholdersEngagementType
} from '@/types/stakeholders';
import {ANNRadarCollection} from '@/types/firestore';

import {ActionContext} from 'vuex';

import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import {database} from '../../libs/firebase';

import GeoJSON from 'ol/format/GeoJSON';

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

const stakeholdersEngagementURLs = {
  [StakeholdersEngagementType.ORGANIZATIONS]:
    'https://storage.googleapis.com/ann-radar-data/stakeholders_organizations_engagement.json',
  [StakeholdersEngagementType.CITIZENS]:
    'https://storage.googleapis.com/ann-radar-data/stakeholders_citizens_engagement.json'
};

const actions = {
  async fetchScenarioDetails(
    {commit}: ActionContext<RootState, StoreState>,
    scenario: Scenario
  ) {
    const {
      balancedScorecardsRef,
      stakeholdersEngagementsRef,
      notesRef,
      baseLayerTypes,
      ...scenarioMetaData
    } = scenario;

    const balancedScorecardRatingsSnapshot = await getDoc(
      balancedScorecardsRef
    );
    const balancedScorecardRatings = balancedScorecardRatingsSnapshot.data();

    let stakeholdersEngagementRatingsSnapshot;
    let stakeholdersEngagementRatings;
    if (stakeholdersEngagementsRef) {
      stakeholdersEngagementRatingsSnapshot = await getDoc(
        stakeholdersEngagementsRef
      );
      stakeholdersEngagementRatings =
        stakeholdersEngagementRatingsSnapshot.data();
    }

    const notesSnapshot = await getDoc(notesRef);
    const notes = notesSnapshot.data();

    commit('setScenarioMetaData', {
      balancedScorecardsId: balancedScorecardRatingsSnapshot.id,
      ...(stakeholdersEngagementRatingsSnapshot && {
        stakeholdersEngagementsId: stakeholdersEngagementRatingsSnapshot.id
      }),
      notesId: notesSnapshot.id,
      ...scenarioMetaData
    });
    commit('setBaseLayerTypes', baseLayerTypes);
    commit('setBalancedScorecardRatings', balancedScorecardRatings);
    if (stakeholdersEngagementRatings) {
      commit('setStakeholdersEngagementRatings', stakeholdersEngagementRatings);
    }
    commit('setNotes', notes);
  },
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
  fetchPotentialConfig({commit}: ActionContext<RootState, StoreState>) {
    return fetch(
      'https://storage.googleapis.com/ann-radar-data/potential_config.json'
    )
      .then(response => response.json())
      .then(data => {
        commit('setPotentialConfig', data);
      })
      .catch(error => console.error(error));
  },
  fetchBalancedScorecard(
    {commit}: ActionContext<RootState, StoreState>,
    type: ScorecardType
  ) {
    return fetch(scorecardURLs[type])
      .then(response => response.json())
      .then(scorecard => {
        commit('setBalancedScorecard', {type, scorecard});
      })
      .catch(error => console.error(error));
  },
  fetchStakeholdersEngagementTemplate(
    {commit}: ActionContext<RootState, StoreState>,
    type: StakeholdersEngagementType
  ) {
    return fetch(stakeholdersEngagementURLs[type])
      .then(response => response.json())
      .then(template => {
        commit('setStakeholdersEngagementTemplates', {type, template});
      })
      .catch(error => console.error(error));
  },
  async fetchLaboratories({commit}: ActionContext<RootState, StoreState>) {
    try {
      const querySnapshot = await getDocs(
        collection(database, ANNRadarCollection.LABORATORIES)
      );
      const laboratories = {} as Record<LaboratoryId, Laboratory>;

      querySnapshot.forEach(doc => {
        const data = doc.data();
        data.feature = new GeoJSON().readFeature(JSON.parse(data.feature));
        data.feature.set('id', doc.id);
        data.feature.set('name', data.name);
        laboratories[doc.id] = data as Laboratory;
      });

      commit('setLaboratories', laboratories);
    } catch (error) {
      console.error('Error loading laboratories:', error);
    }
  },
  async saveLaboratory(
    {commit}: ActionContext<RootState, StoreState>,
    laboratory: Laboratory
  ) {
    if (!laboratory) {
      return;
    }

    const {id, feature: laboratoryFeature, ...data} = laboratory;
    const feature = new GeoJSON().writeFeature(laboratoryFeature);
    let docRef = null;

    try {
      if (id) {
        docRef = doc(database, ANNRadarCollection.LABORATORIES, id);
        await updateDoc(docRef, {
          ...data,
          feature
        });
      } else {
        docRef = await addDoc(
          collection(database, ANNRadarCollection.LABORATORIES),
          {
            ...data,
            feature
          }
        );
      }

      laboratory.feature.set('id', docRef.id);

      commit('setLaboratory', {
        ...laboratory,
        id: docRef.id
      });
    } catch (error) {
      console.error('Error saving laboratory:', error);
      throw `Error saving laboratory: ${error}`;
    }
  },
  async saveScenario({state}: ActionContext<RootState, StoreState>) {
    if (!state.scenarioMetaData) {
      return;
    }

    try {
      const {
        id,
        balancedScorecardsId,
        stakeholdersEngagementsId,
        notesId,
        ...scenarioMetaData
      } = state.scenarioMetaData;

      const scenarioRef = doc(database, ANNRadarCollection.SCENARIOS, id);
      await updateDoc(scenarioRef, {
        ...scenarioMetaData,
        baseLayerTypes: state.baseLayerTypes
      });

      const balancedScorecardsRatingsRef = doc(
        database,
        ANNRadarCollection.BALANCED_SCORECARDS,
        balancedScorecardsId
      );
      await updateDoc(
        balancedScorecardsRatingsRef,
        state.balancedScorecardRatings
      );

      if (stakeholdersEngagementsId) {
        const stakeholdersEngagementRatingsRef = doc(
          database,
          ANNRadarCollection.STAKEHOLDERS_ENGAGEMENTS,
          stakeholdersEngagementsId
        );
        await updateDoc(
          stakeholdersEngagementRatingsRef,
          state.stakeholdersEngagementRatings
        );
      }

      const notesRef = doc(database, ANNRadarCollection.NOTES, notesId);
      await updateDoc(notesRef, state.notes);
    } catch (error) {
      console.error('Error saving scenario:', error);
    }
  },
  updateBalancedScorecardRatings(
    {commit, state}: ActionContext<RootState, StoreState>,
    payload: {
      scorecardType: ScorecardType;
      adminLayerType: AdminLayerType;
      featureId: string;
      measureId: ScorecardMeasureId;
      rating: ScorecardRating;
    }
  ) {
    const ratings = {...state.balancedScorecardRatings};
    ratings[payload.scorecardType] = ratings[payload.scorecardType] || {};
    ratings[payload.scorecardType][payload.adminLayerType] =
      ratings[payload.scorecardType][payload.adminLayerType] || {};
    ratings[payload.scorecardType][payload.adminLayerType][payload.featureId] =
      ratings[payload.scorecardType][payload.adminLayerType][
        payload.featureId
      ] || {};

    if (payload.rating.value === undefined && !payload.rating.comment) {
      delete ratings[payload.scorecardType][payload.adminLayerType][
        payload.featureId
      ][payload.measureId];
    } else {
      ratings[payload.scorecardType][payload.adminLayerType][payload.featureId][
        payload.measureId
      ] = payload.rating;
    }

    commit('setBalancedScorecardRatings', ratings);
  },
  updateStakeholdersEngagementRatings(
    {commit, state}: ActionContext<RootState, StoreState>,
    payload: {
      stakeholdersEngagementType: StakeholdersEngagementType;
      adminLayerType: AdminLayerType;
      featureId: string;
      measureId?: StakeholdersEngagementMeasureId;
      rating?: StakeholdersEngagementRating;
      links?: string;
    }
  ) {
    const ratings = {...state.stakeholdersEngagementRatings};
    ratings[payload.stakeholdersEngagementType] =
      ratings[payload.stakeholdersEngagementType] || {};
    ratings[payload.stakeholdersEngagementType][payload.adminLayerType] =
      ratings[payload.stakeholdersEngagementType][payload.adminLayerType] || {};
    ratings[payload.stakeholdersEngagementType][payload.adminLayerType][
      payload.featureId
    ] =
      ratings[payload.stakeholdersEngagementType][payload.adminLayerType][
        payload.featureId
      ] || {};
    ratings[payload.stakeholdersEngagementType][payload.adminLayerType][
      payload.featureId
    ].ratings =
      ratings[payload.stakeholdersEngagementType][payload.adminLayerType][
        payload.featureId
      ].ratings || {};

    // Update ratings
    if (payload.measureId && payload.rating) {
      if (payload.rating.value === undefined && !payload.rating.comment) {
        delete ratings[payload.stakeholdersEngagementType][
          payload.adminLayerType
        ][payload.featureId].ratings[payload.measureId];
      } else {
        ratings[payload.stakeholdersEngagementType][payload.adminLayerType][
          payload.featureId
        ].ratings[payload.measureId] = payload.rating;
      }
    }

    // Update links
    ratings[payload.stakeholdersEngagementType][payload.adminLayerType][
      payload.featureId
    ].links =
      payload.links ||
      ratings[payload.stakeholdersEngagementType][payload.adminLayerType][
        payload.featureId
      ].links ||
      '';

    commit('setStakeholdersEngagementRatings', ratings);
  }
};

export default actions;
