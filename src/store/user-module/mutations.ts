import {UserState} from '@/types/store';

const mutations = {
  SET_LOGGED_IN(state: UserState, payload: UserState['loggedIn']) {
    state.loggedIn = payload;
  },
  SET_USER(state: UserState, payload: UserState['data']) {
    state.data = payload;
  }
};

export default mutations;
