import {MapStyle} from './map-styles';
import {AdminLayerType, AreasFeaturesDataKeys} from './admin-layers';

export interface StoreState {
  mapStyle: MapStyle;
  baseLayerTypes: Array<string>;
  adminLayerType: AdminLayerType | null;
  selectedFeatureDataKeys: AreasFeaturesDataKeys;
}
