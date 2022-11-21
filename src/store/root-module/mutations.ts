import Vue from 'vue';
import {AdminLayerFeatureId, AdminLayerType} from '@/types/admin-layers';
import {RootState} from '@/types/store';
import {Scorecard, ScorecardRatings, ScorecardType} from '@/types/scorecards';
import {ScenarioMetaData} from '@/types/scenarios';
import {PotentialConfig} from '@/types/potential-config';
import {Laboratory, LaboratoryId} from '@/types/laboratories';
import {
  StakeholdersEngagementRatings,
  StakeholdersEngagementTemplate,
  StakeholdersEngagementType
} from '@/types/stakeholders';

const mutations = {
  setLayersConfig(
    state: RootState,
    newLayersConfig: RootState['layersConfig']
  ) {
    state.layersConfig = newLayersConfig;
  },
  setPotentialConfig(state: RootState, newPotentialConfig: PotentialConfig) {
    state.potentialConfig = newPotentialConfig;
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
    payload: {type: ScorecardType; ratings: ScorecardRatings}
  ) {
    state.balancedScorecardRatings = {
      ...state.balancedScorecardRatings,
      [payload.type]: payload.ratings
    };
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
  toggleBaseLayerType(state: RootState, baseLayerTypeToToggle: string) {
    if (state.baseLayerTypes.includes(baseLayerTypeToToggle)) {
      state.baseLayerTypes = state.baseLayerTypes.filter(
        type => type !== baseLayerTypeToToggle
      );
    } else {
      state.baseLayerTypes = [...state.baseLayerTypes, baseLayerTypeToToggle];
    }
  },
  setHighlightedFeatureIds(
    state: RootState,
    newSelectedFeatureIds: RootState['highlightedFeatureIds']
  ) {
    state.highlightedFeatureIds = newSelectedFeatureIds;
  },
  setSelectedFeatureIdsOfAdminLayer(
    state: RootState,
    payload: {
      adminLayerType: AdminLayerType;
      featureIds: Array<AdminLayerFeatureId>;
    }
  ) {
    state.selectedFeatureIds = {
      ...state.selectedFeatureIds,
      [payload.adminLayerType]: payload.featureIds
    };
  },
  setHoveredLaboratoryId(state: RootState, laboratoryId: LaboratoryId | null) {
    state.hoveredLaboratoryId = laboratoryId;
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
  },
  setLaboratories(state: RootState, laboratories: RootState['laboratories']) {
    state.laboratories = laboratories;
  },
  setStakeholdersEngagementTemplates(
    state: RootState,
    payload: {
      type: StakeholdersEngagementType;
      template: StakeholdersEngagementTemplate;
    }
  ) {
    state.stakeholdersEngagementTemplates = {
      ...state.stakeholdersEngagementTemplates,
      [payload.type]: payload.template
    };
  },
  setStakeholdersEngagementRatings(
    state: RootState,
    newStakeholdersEngagementRatings: Record<
      StakeholdersEngagementType,
      StakeholdersEngagementRatings
    >
  ) {
    state.stakeholdersEngagementRatings = newStakeholdersEngagementRatings;
  },
  resetStakeholdersEngagementRatings(state: RootState) {
    state.stakeholdersEngagementRatings = Object.values(ScorecardType).reduce(
      (ratings, stakeholdersEngagementType) => ({
        ...ratings,
        [stakeholdersEngagementType]: {}
      }),
      {} as Record<StakeholdersEngagementType, StakeholdersEngagementRatings>
    );
  }
};

export default mutations;
