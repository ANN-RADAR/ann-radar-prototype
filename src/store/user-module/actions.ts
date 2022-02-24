import router from '@/router';
import {StoreState, UserState} from '@/types/store';
import {ActionTree} from 'vuex';

const actions: ActionTree<UserState, StoreState> = {
  changed({commit}, user) {
    if (user) {
      commit('SET_USER', user);
      router.push('/');
    } else {
      commit('SET_USER', null);
      router.push('/');
    }
  }
};

export default actions;
