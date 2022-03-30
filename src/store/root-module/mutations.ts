import {AdminLayerType, FeaturesDataKeys} from '@/types/admin-layers';
import {RootState} from '@/types/store';

const mutations = {
  setLayersConfig(
    state: RootState,
    newLayersConfig: RootState['layersConfig']
  ) {
    state.layersConfig = newLayersConfig;
  },
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
  setAdminLayerData(
    state: RootState,
    newAdminLayerData: RootState['adminLayerData']
  ) {
    state.adminLayerData = newAdminLayerData;
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
  },
  setNote(
    state: RootState,
    payload: {
      adminLayerType: AdminLayerType;
      note: string;
    }
  ) {
    state.adminLayerData = {
      ...state.adminLayerData,
      [payload.adminLayerType]: {
        ...state.adminLayerData[payload.adminLayerType],
        note: payload.note
      }
    };
  }
};

export default mutations;
