import {RootState} from '@/types/store';
import {MapStyle} from '@/types/map-styles';
import {AdminLayerType, AdminLayerFeatureId} from '@/types/admin-layers';
import {Scorecard, ScorecardRatings, ScorecardType} from '@/types/scorecards';
import {Laboratory, LaboratoryId} from '@/types/laboratories';
import {
  StakeholdersEngagementRatings,
  StakeholdersEngagementType
} from '@/types/stakeholders';

const state: RootState = {
  scenarioMetaData: null,
  layersConfig: {},
  potentialConfig: null,
  layerClassificationSelection: {},
  mapStyle: MapStyle.COLORED,
  baseLayerTypes: [],
  adminLayerType: null,
  selectedFeatureIds: {} as Record<AdminLayerType, Array<AdminLayerFeatureId>>,
  highlightedFeatureIds: [],
  balancedScorecards: Object.values(ScorecardType).reduce(
    (scorecards, scorecardType) => ({...scorecards, [scorecardType]: []}),
    {} as Record<ScorecardType, Scorecard>
  ),
  balancedScorecardRatings: Object.values(ScorecardType).reduce(
    (ratings, scorecardType) => ({
      ...ratings,
      [scorecardType]: {} as ScorecardRatings
    }),
    {} as Record<ScorecardType, ScorecardRatings>
  ),
  notes: {},
  laboratories: {} as Record<LaboratoryId, Laboratory>,
  hoveredLaboratoryId: null,
  stakeholdersEngagementRatings: Object.values(ScorecardType).reduce(
    (ratings, stakeholdersEngagementType) => ({
      ...ratings,
      [stakeholdersEngagementType]: {} as StakeholdersEngagementRatings
    }),
    {} as Record<StakeholdersEngagementType, StakeholdersEngagementRatings>
  )
};

export default state;
