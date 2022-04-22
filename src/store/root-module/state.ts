import {RootState} from '@/types/store';
import {MapStyle} from '@/types/map-styles';
import {AdminLayerType, AdminLayerData} from '@/types/admin-layers';
import {Scorecard, ScorecardRatings, ScorecardType} from '@/types/scorecards';

const state: RootState = {
  layersConfig: {},
  layerClassificationSelection: {},
  mapStyle: MapStyle.COLORED,
  baseLayerTypes: [],
  adminLayerType: null,
  adminLayerData: {} as Record<AdminLayerType, AdminLayerData>,
  scorecards: Object.values(ScorecardType).reduce(
    (scorecards, scorecardType) => ({...scorecards, [scorecardType]: []}),
    {} as Record<ScorecardType, Scorecard>
  ),
  scorecardRatings: Object.values(ScorecardType).reduce(
    (ratings, scorecardType) => ({
      ...ratings,
      [scorecardType]: {} as ScorecardRatings
    }),
    {} as Record<ScorecardType, ScorecardRatings>
  )
};

export default state;
