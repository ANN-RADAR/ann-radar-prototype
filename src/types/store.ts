import {Accessors} from 'vue/types/options';
import {MapStyle} from './map-styles';
import {AdminLayerType, AreasFeaturesDataKeys} from './admin-layers';
import {modules} from '../store/index';
export interface RootState {
  mapStyle: MapStyle;
  baseLayerTypes: Array<string>;
  adminLayerType: AdminLayerType | null;
  selectedFeatureDataKeys: AreasFeaturesDataKeys;
}

export interface UserState {
  data: {email: string} | null;
}

export interface StoreState {
  root: RootState;
  user: UserState;
}

export interface MapStateToComputed {
  <Key extends keyof StoreState[Module], Module extends keyof StoreState>(
    module: Module,
    map: Key[]
  ): Accessors<{
    [K in Key]: StoreState[Module][K];
  }>;
}

type CustomReturnType<T> = T extends (...args: any) => infer R ? R : any;
export interface MapGettersToComputed {
  <
    Module extends keyof typeof modules,
    Getters extends keyof typeof modules[Module]['getters']
  >(
    module: Module,
    map: Getters[]
  ): Accessors<{
    [Getter in Getters]: CustomReturnType<
      typeof modules[Module]['getters'][Getter]
    >;
  }>;
}

type PayloadParameter<
  ModuleState extends StoreState[keyof StoreState],
  T
> = T extends (state: ModuleState, payload: infer P) => any ? P : never;

export interface MapMutationsToMethods {
  <
    Module extends keyof typeof modules,
    Mutations extends keyof typeof modules[Module]['mutations']
  >(
    module: Module,
    map: Mutations[]
  ): {
    [Mutation in Mutations]: (
      payload: PayloadParameter<
        typeof modules[Module]['state'],
        typeof modules[Module]['mutations'][Mutation]
      >
    ) => void;
  };
}
