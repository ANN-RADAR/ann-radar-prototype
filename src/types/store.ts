import {Accessors} from 'vue/types/options';
import {MapStyle} from './map-styles';
import {AdminLayerType, AdminLayerData} from './admin-layers';
import {modules} from '../store/index';
import {LayerConfig} from './layers';
import {Scorecard, ScorecardRatings, ScorecardType} from './scorecards';
import {ActionContext} from 'vuex';

export interface RootState {
  layersConfig: Record<string /* layer type */, LayerConfig>;
  layerClassificationSelection: Record<
    string /* layer type */,
    number /* selected classification index */
  >;
  mapStyle: MapStyle;
  baseLayerTypes: Array<string>;
  adminLayerType: AdminLayerType | null;
  adminLayerData: Record<AdminLayerType, AdminLayerData>;
  scorecards: Record<ScorecardType, Scorecard>;
  scorecardRatings: Record<ScorecardType, ScorecardRatings>;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

type MutationsPayloadParameter<
  ModuleState extends StoreState[keyof StoreState],
  T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      payload: MutationsPayloadParameter<
        typeof modules[Module]['state'],
        typeof modules[Module]['mutations'][Mutation]
      >
    ) => void;
  };
}

type ActionsPayloadParameter<
  ModuleState extends StoreState[keyof StoreState],
  T
> = T extends (
  context: ActionContext<ModuleState, StoreState>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any
  ? never
  : T extends (
      context: ActionContext<ModuleState, StoreState>,
      payload: infer P
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => any
  ? P
  : never;

export interface MapActionsToMethods {
  <
    Module extends keyof typeof modules,
    Actions extends keyof typeof modules[Module]['actions']
  >(
    module: Module,
    map: Actions[]
  ): {
    [Action in Actions]: ActionsPayloadParameter<
      typeof modules[Module]['state'],
      typeof modules[Module]['actions'][Action]
    > extends never
      ? () => void
      : (
          payload: ActionsPayloadParameter<
            typeof modules[Module]['state'],
            typeof modules[Module]['actions'][Action]
          >
        ) => void;
  };
}
