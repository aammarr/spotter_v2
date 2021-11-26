import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_USER = "updateUser";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_REFRESH = "setRefresh";
export const SET_ERROR = "setError";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken(),
  appUser: {},
  isTokenExpired: false,
  isFilterEnable: false
};

const getters = {
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  isFilterEnable(state) {
    return state.isFilterEnable;
  },
  appUserGetter(state) {
    return state.appUser;
  },
  isTokenExpiredGetter(state) {
    return state.isTokenExpired;
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("login", credentials)
        .then(({ data }) => {
          if (data.status == "failed") {
            let errors = data.message;
            context.commit(SET_ERROR, errors);
          } else {
            context.commit(SET_AUTH, data);
            resolve(data);
          }
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [VERIFY_AUTH](context) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  async appUserAction({ commit }) {
    let response = await ApiService.get("/me");
    commit("appUserMutation", response.data);
  },
  // token expired action
  async isTokenExpiredAction({ commit }) {
    let diff = JwtService.getTokenTimeDiff();
    if (diff < 3500 && diff > 0) {
      let dataToPost = {
        token: JwtService.getToken()
      };
      await ApiService.post("refresh", dataToPost).then(res => {
        commit(SET_REFRESH, res.data);
      });
    } else {
      commit("isTokenExpiredMutation", true);
    }
  },
  isFilterEnableAction({ commit }, isFilterEnable) {
    commit("isFilterEnableMutation", isFilterEnable);
  }
};

const mutations = {
  // token expire mutation
  isTokenExpiredMutation: (state, isTokenExpired) => {
    state.isAuthenticated = false;
    state.isTokenExpired = isTokenExpired;
  },
  isFilterEnableMutation: (state, isFilterEnable) =>
    (state.isFilterEnable = isFilterEnable),
  appUserMutation: (state, appUser) => (state.appUser = appUser),
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user.data;
    state.errors = null;
    state.isTokenExpired = false;
    JwtService.saveToken(state.user.token, 3600);
  },
  [SET_REFRESH](state, data) {
    state.isAuthenticated = true;
    state.errors = null;
    state.isTokenExpired = false;
    JwtService.saveToken(data.token, data.expires_in);
    ApiService.setHeader();
    window.location.reload();
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = null;
    JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
