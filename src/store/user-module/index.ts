import actions from './actions';
import state from './state';
import mutations from './mutations';
import store from '..';

const user = {
  namespaced: true,
  state,
  mutations,
  getters: {},
  actions,
  beforeCreate() {
    store.commit('initialiseStore');
  }
};

export default user;
