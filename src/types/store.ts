import {Accessors} from 'vue/types/options';
import {MapStyle} from './map-styles';
import {AdminLayerType, AreasFeaturesDataKeys} from './admin-layers';
import mutations from '../store/mutations';

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

type PayloadParameter<T extends (state: StoreState, payload: any) => any> =
  T extends (state: StoreState, payload: infer P) => any ? P : never;

export interface MapMutationsToMethods {
  <Key extends keyof typeof mutations>(map: Key[]): {
    [K in Key]: (payload: PayloadParameter<typeof mutations[K]>) => void;
  };
}
