import {doc, getDoc} from 'firebase/firestore';
import {ActionContext, ActionTree} from 'vuex';

import {ANNRadarCollection} from '@/types/firestore';
import {StoreState, UserState} from '@/types/store';
import {database} from '@/libs/firebase';

const actions: ActionTree<UserState, StoreState> = {
  async initializeStore({commit}) {
    const user = localStorage.getItem('user');
    if (user) {
      commit('setUser', JSON.parse(user));
    }
  },
  async fetchUserRoles({commit, state}: ActionContext<UserState, StoreState>) {
    if (!state.data) {
      return;
    }

    try {
      const userRolesRef = doc(
        database,
        ANNRadarCollection.USERS,
        state.data?.uid
      );

      const userRolesRefSnapshot = await getDoc(userRolesRef);

      if (userRolesRefSnapshot.exists()) {
        commit('setUserRoles', userRolesRefSnapshot.data().roles);
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
    }
  }
};

export default actions;
