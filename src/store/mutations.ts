import {AreasFeaturesDataKeys} from '@/types/admin-layers';
import {StoreState} from '@/types/store';

const mutations = {
  setAdminLayerType(
    state: StoreState,
    newAdminLayerType: StoreState['adminLayerType']
  ) {
    state.adminLayerType = newAdminLayerType;
  },
  setMapStyle(state: StoreState, newMapStyle: StoreState['mapStyle']) {
    state.mapStyle = newMapStyle;
  },
  setBaseLayerTypes(
    state: StoreState,
    newBaseLayerTypes: StoreState['baseLayerTypes']
  ) {
    state.baseLayerTypes = newBaseLayerTypes;
  },
  setSelectedFeatureDataKeys(
    state: StoreState,
    payload: {
      layerType: keyof AreasFeaturesDataKeys;
      keys: AreasFeaturesDataKeys[keyof AreasFeaturesDataKeys];
    }
  ) {
    state.selectedFeatureDataKeys = {
      ...state.selectedFeatureDataKeys,
      [payload.layerType]: payload.keys
    };
  }
};

export default mutations;
