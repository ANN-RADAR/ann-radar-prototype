import Vue from 'vue';
import Vuex from 'vuex';
import {AdminLayerType} from '@/types/admin-layers';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    mapStyle: 'farbig',
    baseLayerTypes: [],
    adminLayerType: null as AdminLayerType | null,
    selectedFeatureDataIds: {} as Record<AdminLayerType, Array<string>>
  },
  mutations: {
    setAdminLayerType(state, newAdminLayerType) {
      state.adminLayerType = newAdminLayerType;
    },
    setMapStyle(state, newMapStyle) {
      state.mapStyle = newMapStyle;
    },
    setBaseLayerTypes(state, newBaseLayerTypes) {
      state.baseLayerTypes = newBaseLayerTypes;
    },
    setSelectedFeatureDataIds(state, payload) {
      state.selectedFeatureDataIds = {
        ...state.selectedFeatureDataIds,
        [payload.layerType]: payload.ids
      };
    }
  }
});

export default store;
