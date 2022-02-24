import router from '@/router';
import {StoreState, UserState} from '@/types/store';
import {ActionTree} from 'vuex';

const actions: ActionTree<UserState, StoreState> = {
  changed({commit}, user) {
    if (user) {
      commit('setUser', user);

      router.push('/');
    } else {
      commit('setUser', null);
      router.push('/login');
    }
  },
  async initializeStore({commit}) {
    const user = localStorage.getItem('user');
    if (user) {
      commit('setUser', JSON.parse(user));
    }
  }
};

export default actions;
