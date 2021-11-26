const state = {
  isSync: false
};
const getters = {
  isSyncGetter: state => state.isSync
};
const actions = {
  setIsSyncAction({ commit }, con) {
    commit("setIsSyncMutation", con);
  }
};

const mutations = {
  setIsSyncMutation: (state, con) => (state.isSync = con)
};

export default {
  state,
  getters,
  actions,
  mutations
};
