import {RootState, StoreState} from '@/types/store';
import {ActionTree} from 'vuex';

const actions: ActionTree<RootState, StoreState> = {
  fetchLayersConfig({commit}) {
    return fetch(
      'https://storage.googleapis.com/ann-radar-data/layers_config.json'
    )
      .then(response => response.json())
      .then(data => {
        commit('setLayersConfig', data);
      })
      .catch(error => console.error(error));
  }
};

export default actions;
