import actions from './actions';
import state from './state';
import mutations from './mutations';

const user = {
  namespaced: true,
  state,
  mutations,
  getters: {},
  actions
};

export default user;
