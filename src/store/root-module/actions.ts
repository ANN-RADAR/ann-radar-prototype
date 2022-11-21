import {AdminLayerFeatureId, AdminLayerType} from '@/types/admin-layers';
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
      stakeholdersEngagementsRef,
      notesRef,
      baseLayerTypes,
      ...scenarioMetaData
    } = scenario;

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
      ...(stakeholdersEngagementRatingsSnapshot && {
        stakeholdersEngagementsId: stakeholdersEngagementRatingsSnapshot.id
      }),
      notesId: notesSnapshot.id,
      ...scenarioMetaData
    });
    commit('setBaseLayerTypes', baseLayerTypes);
    if (stakeholdersEngagementRatings) {
      commit('setStakeholdersEngagementRatings', stakeholdersEngagementRatings);
    } else {
      commit('resetStakeholdersEngagementRatings');
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
  async fetchBalancedScorecardRatings(
    {commit}: ActionContext<RootState, StoreState>,
    type: ScorecardType
  ) {
    try {
      const querySnapshot = await getDoc(
        doc(database, ANNRadarCollection.BALANCED_SCORECARDS, type)
      );
      const ratings = querySnapshot.data();

      commit('setBalancedScorecardRatings', {type, ratings});
    } catch (error) {
      console.error('Error loading balanced scorecard ratings:', error);
    }
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
      const {id, stakeholdersEngagementsId, notesId, ...scenarioMetaData} =
        state.scenarioMetaData;

      const hasStakeholdersEngagementRatings = Object.values(
        state.stakeholdersEngagementRatings
      ).some(ratings => Object.values(ratings).length);
      let stakeholdersEngagementRatingsRef;

      if (stakeholdersEngagementsId) {
        // Update existing stakeholders engagement ratings
        const stakeholdersEngagementRatingsRef = doc(
          database,
          ANNRadarCollection.STAKEHOLDERS_ENGAGEMENTS,
          stakeholdersEngagementsId
        );
        await updateDoc(
          stakeholdersEngagementRatingsRef,
          state.stakeholdersEngagementRatings
        );
      } else if (hasStakeholdersEngagementRatings) {
        // Add stakeholders engagement ratings
        const stakeholdersEngagementCollectionRef = collection(
          database,
          ANNRadarCollection.STAKEHOLDERS_ENGAGEMENTS
        );
        stakeholdersEngagementRatingsRef = await addDoc(
          stakeholdersEngagementCollectionRef,
          state.stakeholdersEngagementRatings
        );
      }

      const notesRef = doc(database, ANNRadarCollection.NOTES, notesId);
      await updateDoc(notesRef, state.notes);

      const scenarioRef = doc(database, ANNRadarCollection.SCENARIOS, id);
      await updateDoc(scenarioRef, {
        ...scenarioMetaData,
        baseLayerTypes: state.baseLayerTypes,
        ...(stakeholdersEngagementRatingsRef && {
          stakeholdersEngagementRatingsRef
        })
      });
    } catch (error) {
      console.error('Error saving scenario:', error);
    }
  },
  async updateBalancedScorecardRatings(
    {commit, state}: ActionContext<RootState, StoreState>,
    payload: {
      scorecardType: ScorecardType;
      adminLayerType: AdminLayerType;
      featureId: AdminLayerFeatureId;
      measureId: ScorecardMeasureId;
      rating: ScorecardRating;
    }
  ) {
    const {scorecardType, adminLayerType, featureId, measureId, rating} =
      payload;

    const ratings = {
      ...(state.balancedScorecardRatings[scorecardType] || {})
    };
    ratings[adminLayerType] = ratings[adminLayerType] || {};
    ratings[adminLayerType][featureId] =
      ratings[adminLayerType][featureId] || {};

    if (rating.value === undefined && !rating.comment) {
      // Delete empty measure object
      delete ratings[adminLayerType][featureId][measureId];

      // Delete empty feature object
      if (!Object.values(ratings[adminLayerType][featureId]).length) {
        delete ratings[adminLayerType][featureId];
      }
    } else {
      ratings[adminLayerType][featureId][measureId] = rating;
    }

    try {
      // Save ratings in Firestore
      const ratingsRef = doc(
        database,
        ANNRadarCollection.BALANCED_SCORECARDS,
        scorecardType
      );
      await updateDoc(ratingsRef, ratings);

      // Update ratings in store
      commit('setBalancedScorecardRatings', {type: scorecardType, ratings});
    } catch (error) {
      console.error('Error saving balanced scorecard ratings:', error);
    }
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
    const {
      stakeholdersEngagementType: type,
      adminLayerType,
      featureId,
      measureId,
      rating,
      links
    } = payload;
    const ratings = {...state.stakeholdersEngagementRatings};

    // Start new ratings object for the given feature if necessary
    ratings[type] = ratings[type] || {};
    ratings[type][adminLayerType] = ratings[type][adminLayerType] || {};
    ratings[type][adminLayerType][featureId] =
      ratings[type][adminLayerType][featureId] || {};
    ratings[type][adminLayerType][featureId].ratings =
      ratings[type][adminLayerType][featureId].ratings || {};

    // Update ratings
    if (measureId && rating) {
      if (rating.value === undefined && !rating.comment) {
        delete ratings[type][adminLayerType][featureId].ratings[measureId];
      } else {
        ratings[type][adminLayerType][featureId].ratings[measureId] = rating;
      }
    }

    // Update links
    ratings[type][adminLayerType][featureId].links =
      links || ratings[type][adminLayerType][featureId].links || '';

    commit('setStakeholdersEngagementRatings', ratings);
  }
};

export default actions;
