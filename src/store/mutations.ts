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
  },
  SET_LOGGED_IN(state: StoreState, value: StoreState['user']['loggedIn']) {
    state.user.loggedIn = value;
  },
  SET_USER(state: StoreState, data: StoreState['user']['data']) {
    state.user.data = data;
  }
};

export default mutations;
