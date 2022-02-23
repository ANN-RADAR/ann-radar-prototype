import router from '@/router';
import {StoreState} from '@/types/store';
import {ActionTree} from 'vuex';

const actions: ActionTree<StoreState, StoreState> = {
  fetchUser({commit}, user) {
    commit('SET_LOGGED_IN', user !== null);

    if (user) {
      commit('SET_USER', {
        displayName: user.displayName,
        email: user.email
      });
      router.push('/');
    } else {
      commit('SET_USER', null);
      router.push('/');
    }
  }
};

export default actions;
