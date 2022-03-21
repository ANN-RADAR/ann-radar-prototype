import {AdminLayerData, AdminLayerType} from './admin-layers';

export interface Scenario {
  scenarioTitle: string;
  adminLayerData: Record<AdminLayerType, AdminLayerData>;
  baseLayerTypes: Array<string>;
}
