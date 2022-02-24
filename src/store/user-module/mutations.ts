import {UserState} from '@/types/store';

const mutations = {
  setUser(state: UserState, user: UserState['data']) {
    state.data = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
};

export default mutations;
