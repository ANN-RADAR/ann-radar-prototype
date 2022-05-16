import {RootState} from '@/types/store';
import {MapStyle} from '@/types/map-styles';
import {AdminLayerType} from '@/types/admin-layers';
import {Scorecard, ScorecardRatings, ScorecardType} from '@/types/scorecards';

const state: RootState = {
  scenarioMetaData: null,
  layersConfig: {},
  layerClassificationSelection: {},
  mapStyle: MapStyle.COLORED,
  baseLayerTypes: [],
  adminLayerType: null,
  selectedFeatureIds: {} as Record<AdminLayerType, Array<string>>,
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
  laboratory: {
    name: '',
    description: '',
    feature: null
  }
};

export default state;
