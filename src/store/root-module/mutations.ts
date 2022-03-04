import {AdminLayerType, FeaturesDataKeys} from '@/types/admin-layers';
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
      adminLayerType: AdminLayerType;
      keys: Array<FeaturesDataKeys>;
    }
  ) {
    state.adminLayerData = {
      ...state.adminLayerData,
      [payload.adminLayerType]: {
        ...state.adminLayerData[payload.adminLayerType],
        selectedFeatureDataKeys: payload.keys
      }
    };
  }
};

export default mutations;
