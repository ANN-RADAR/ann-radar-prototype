import {UserState} from '@/types/store';

const mutations = {
  setUser(state: UserState, user: UserState['data']) {
    state.data = user;

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },
  setUserRoles(state: UserState, roles: UserState['roles']) {
    state.roles = roles;
  }
};

export default mutations;
