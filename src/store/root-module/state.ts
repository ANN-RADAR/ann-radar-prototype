import {RootState} from '@/types/store';
import {MapStyle} from '@/types/map-styles';
import {AdminLayerType, AdminLayerFeatureId} from '@/types/admin-layers';
import {Scorecard, ScorecardRatings, ScorecardType} from '@/types/scorecards';
import {Laboratory, LaboratoryId} from '@/types/laboratories';
import {
  StakeholdersEngagementRatings,
  StakeholdersEngagementTemplate,
  StakeholdersEngagementType
} from '@/types/stakeholders';
import {MobilityLocation} from '@/types/potential';
import {GeoJSONFeature} from 'ol/format/GeoJSON';

const state: RootState = {
  scenarioMetaData: null,
  layersConfig: {},
  potentialConfig: null,
  layerClassificationSelection: {},
  mapStyle: MapStyle.GRAY_BLUE,
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
  stakeholdersEngagementTemplates: Object.values(
    StakeholdersEngagementType
  ).reduce(
    (templates, stakeholdersEngagementType) => ({
      ...templates,
      [stakeholdersEngagementType]: []
    }),
    {} as Record<StakeholdersEngagementType, StakeholdersEngagementTemplate>
  ),
  stakeholdersEngagementRatings: Object.values(ScorecardType).reduce(
    (ratings, stakeholdersEngagementType) => ({
      ...ratings,
      [stakeholdersEngagementType]: {} as StakeholdersEngagementRatings
    }),
    {} as Record<StakeholdersEngagementType, StakeholdersEngagementRatings>
  ),
  mobilityLocations: [] as Array<MobilityLocation>,
  mobilityIsochrones: {} as Record<string, Array<GeoJSONFeature>>
};

export default state;
