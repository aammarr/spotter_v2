import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/jwt.service";
// import store from '../services/store/auth.module';
import store from "@/core/services/store";
/**
 * Service to call HTTP request via Axios
 */
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    ApiService.saveUserActivity();
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = "http://spotter-be.efocus.store/api/auth";
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug [slug = " ",/${slug}]
   * @returns {*}
   */
  get(resource) {
    // this.saveUserActivity();
    // Vue.axios.get(`${resource}`).then(() => this.saveUserActivity());
    return Vue.axios.get(`${resource}`).catch(error => {
      // check if token is expired
      if (error.response.status == 401) {
        store.dispatch("isTokenExpiredAction");
        throw new Error(`[KT] ApiService ${error}`);
      }
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    // this.saveUserActivity();
    // Vue.axios.post(`${resource}`).then(() => this.saveUserActivity());
    return Vue.axios.post(`${resource}`, params);
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      // console.log(error);
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },
  getApi(url) {
    return axios
      .get(Vue.axios.defaults.baseURL + url, {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vc3BvdHRlci1iZS5lZm9jdXMuc3RvcmUvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE2MTE5MTYxODAsImV4cCI6MTYxMTkxOTc4MCwibmJmIjoxNjExOTE2MTgwLCJqdGkiOiJJSVpOd2Ntakl2RkJMVENoIiwic3ViIjoxLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.q5HPRW5wxXO9x3Xclj-zCHfKr34fFdLtVv9Q67G68zw"
        }
      })
      .then(
        function(response) {
          return response;
        }.bind(this)
      )
      .catch(function(error) {
        if (error) {
          return error.response;
        }
      });
  },
  saveUserActivity() {
    JwtService.saveUserActiveTime();
  }
};

export default ApiService;
