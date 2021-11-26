const state = {
  clients: [],
  coupons: [],
  date_from: null,
  date_to: null,
  filters: {
    clients: [],
    coupons: [],
    date_from: null,
    date_to: null
  }
};
const getters = {
  clientFilterGetter: state => state.clients,
  couponFilterGetter: state => state.coupons,
  startDateGetter: state => (state.date_from ? state.date_from : " "),
  endDateGetter: state => (state.date_to ? state.date_to : " "),
  filtersGetter: state => state.filters
};
const actions = {
  setFiltersAction({ commit }, filters) {
    commit("setFiltersMutation", filters);
  },
  clientFilterAction({ commit }, clientArr) {
    commit("clientFilterMutation", clientArr);
  },
  couponFilterAction({ commit }, couponArr) {
    commit("couponFilterMutation", couponArr);
  },
  startDateAction({ commit }, date_from) {
    commit("startDateMutation", date_from);
  },
  endDateAction({ commit }, date_to) {
    commit("endDateMutation", date_to);
  }
};

const mutations = {
  clientFilterMutation: (state, clientsArr) => (state.clients = clientsArr),
  couponFilterMutation: (state, couponsArr) => (state.coupons = couponsArr),
  startDateMutation: (state, date_from) => (state.startDate = date_from),
  endDateMutation: (state, date_to) => (state.date_to = date_to),
  setFiltersMutation: (state, filters) => (state.filters = filters)
};

export default {
  state,
  getters,
  actions,
  mutations
};
