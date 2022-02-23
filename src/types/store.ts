import {MapStyle} from './map-styles';
import {AdminLayerType, AreasFeaturesDataKeys} from './admin-layers';
import {Accessors} from 'vue/types/options';

export interface StoreState {
  mapStyle: MapStyle;
  baseLayerTypes: Array<string>;
  adminLayerType: AdminLayerType | null;
  selectedFeatureDataKeys: AreasFeaturesDataKeys;
}

export interface MapStateToComputed {
  <Key extends keyof StoreState>(map: Key[]): Accessors<{
    [K in Key]: StoreState[K];
  }>;
}
