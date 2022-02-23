import {StoreState} from '@/types/store';
import {MapStyle} from '@/types/map-styles';
import {AreasFeaturesDataKeys} from '@/types/admin-layers';

const state: StoreState = {
  mapStyle: MapStyle.COLORED,
  baseLayerTypes: [],
  adminLayerType: null,
  selectedFeatureDataKeys: {} as AreasFeaturesDataKeys
};

export default state;
