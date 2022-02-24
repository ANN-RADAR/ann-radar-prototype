import {UserState} from '@/types/store';

const mutations = {
  SET_USER(state: UserState, user: UserState['data']) {
    state.data = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  initializeStore(state: UserState) {
    const user = localStorage.getItem('user');
    if (user) {
      state.data = JSON.parse(user);
    }
  }
};

export default mutations;
