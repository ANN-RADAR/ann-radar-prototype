import Vue from 'vue';
import Vuex from 'vuex';
import {AdminLayerType} from '@/types/admin-layers';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    mapStyle: 'farbig',
    baseLayerType: null,
    adminLayerType: null,
    selectedFeatureDataIds: {} as Record<AdminLayerType, Array<string>>
  },
  mutations: {
    setAdminLayerType(state, newAdminLayerType) {
      state.adminLayerType = newAdminLayerType;
    },
    setMapStyle(state, newMapStyle) {
      state.mapStyle = newMapStyle;
    }
  }
});

export default store;
