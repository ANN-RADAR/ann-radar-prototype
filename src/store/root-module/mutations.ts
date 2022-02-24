import {AreasFeaturesDataKeys} from '@/types/admin-layers';
import {RootState} from '@/types/store';

const mutations = {
  setAdminLayerType(
    state: RootState,
    newAdminLayerType: RootState['adminLayerType']
  ) {
    state.adminLayerType = newAdminLayerType;
  },
  setMapStyle(state: RootState, newMapStyle: RootState['mapStyle']) {
    state.mapStyle = newMapStyle;
  },
  setBaseLayerTypes(
    state: RootState,
    newBaseLayerTypes: RootState['baseLayerTypes']
  ) {
    state.baseLayerTypes = newBaseLayerTypes;
  },
  setSelectedFeatureDataKeys(
    state: RootState,
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
