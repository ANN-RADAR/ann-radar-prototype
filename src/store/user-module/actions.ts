import {StoreState, UserState} from '@/types/store';
import {ActionTree} from 'vuex';

const actions: ActionTree<UserState, StoreState> = {
  async initializeStore({commit}) {
    const user = localStorage.getItem('user');
    if (user) {
      commit('setUser', JSON.parse(user));
    }
  }
};

export default actions;
