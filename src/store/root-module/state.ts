import {RootState} from '@/types/store';
import {MapStyle} from '@/types/map-styles';
import {AdminLayerType, AdminLayerData} from '@/types/admin-layers';
import {Scorecard, ScorecardType} from '@/types/scorecards';

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
  )
};

export default state;
