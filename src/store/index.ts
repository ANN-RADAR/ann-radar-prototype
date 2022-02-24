import Vue from 'vue';
import Vuex from 'vuex';

import user from './user-module/index';
import root from './root-module/index';
import {StoreState} from '@/types/store';
Vue.use(Vuex);

export const modules = {
  user,
  root
};

const store = new Vuex.Store<StoreState>({
  modules
});

export default store;
