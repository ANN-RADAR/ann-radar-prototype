import Vue from 'vue';
import {AdminLayerType} from '@/types/admin-layers';
import {Laboratory, RootState} from '@/types/store';
import {Scorecard, ScorecardRatings, ScorecardType} from '@/types/scorecards';
import {ScenarioMetaData} from '@/types/scenarios';

const mutations = {
  setLayersConfig(
    state: RootState,
    newLayersConfig: RootState['layersConfig']
  ) {
    state.layersConfig = newLayersConfig;
  },
  setScenarioMetaData(state: RootState, newScenarioMetaData: ScenarioMetaData) {
    state.scenarioMetaData = newScenarioMetaData;
  },
  setBalancedScorecard(
    state: RootState,
    payload: {type: ScorecardType; scorecard: Scorecard}
  ) {
    state.balancedScorecards = {
      ...state.balancedScorecards,
      [payload.type]: payload.scorecard
    };
  },
  setBalancedScorecardRatings(
    state: RootState,
    newScorecardRatings: Record<ScorecardType, ScorecardRatings>
  ) {
    state.balancedScorecardRatings = newScorecardRatings;
  },
  setLayerClassificationSelection(
    state: RootState,
    payload: {layerType: string; selectedClassificationIndex: number | null}
  ) {
    if (!payload.selectedClassificationIndex) {
      Vue.delete(state.layerClassificationSelection, payload.layerType);
    } else {
      state.layerClassificationSelection = {
        ...state.layerClassificationSelection,
        [payload.layerType]: payload.selectedClassificationIndex
      };
    }
  },
  setAdminLayerType(
    state: RootState,
    newAdminLayerType: RootState['adminLayerType']
  ) {
    state.adminLayerType = newAdminLayerType;
  },
  setMapStyle(state: RootState, newMapStyle: RootState['mapStyle']) {
    state.mapStyle = newMapStyle;
  },
  setBaseLayerTypes(
    state: RootState,
    newBaseLayerTypes: RootState['baseLayerTypes']
  ) {
    state.baseLayerTypes = newBaseLayerTypes;
  },
  setSelectedFeatureIds(
    state: RootState,
    newSelectedFeatureIds: RootState['selectedFeatureIds']
  ) {
    state.selectedFeatureIds = newSelectedFeatureIds;
  },
  setSelectedFeatureIdsOfAdminLayer(
    state: RootState,
    payload: {adminLayerType: AdminLayerType; featureIds: Array<string>}
  ) {
    state.selectedFeatureIds = {
      ...state.selectedFeatureIds,
      [payload.adminLayerType]: payload.featureIds
    };
  },
  setNote(state: RootState, payload: {path: string; note: string}) {
    state.notes = {...state.notes, [payload.path]: payload.note};
  },
  setNotes(state: RootState, newNotes: Record<string, string>) {
    state.notes = newNotes;
  },
  setLaboratory(state: RootState, laboratory: Laboratory) {
    state.laboratories = {
      ...state.laboratories,
      [laboratory.id as string]: laboratory
    };
  }
};

export default mutations;
