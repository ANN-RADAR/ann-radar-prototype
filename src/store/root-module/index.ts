import state from './state';
import getters from './getters';
import mutations from './mutations';

const root = {
  namespaced: true,
  state,
  getters,
  mutations
};

export default root;
