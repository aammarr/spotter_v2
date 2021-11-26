import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/core/services/store";
import ApiService from "@/core/services/api.service";
import Chat from "vue-beautiful-chat";
Vue.use(Chat);

import { VERIFY_AUTH } from "@/core/services/store/auth.module";
import { RESET_LAYOUT_CONFIG } from "@/core/services/store/config.module";
Vue.config.productionTip = false;
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
Vue.use(VueSweetalert2);
import TextHighlight from "vue-text-highlight";
Vue.component("text-highlight", TextHighlight);
// register globally
Vue.component("multiselect", Multiselect);
Vue.component("DatePicker", DatePicker);
require("vue-multiselect/dist/vue-multiselect.min.css");
// Global 3rd party plugins
import "popper.js";
import "tooltip.js";
import PerfectScrollbar from "perfect-scrollbar";
window.PerfectScrollbar = PerfectScrollbar;
import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/highlight-js";
import "@/core/plugins/inline-svg";
import "@/core/plugins/apexcharts";
import "@/core/plugins/animation";

ApiService.init();

router.beforeEach((to, from, next) => {
  // Ensure we checked auth before each page load.
  if (to.meta.restricted && store.state.auth.isAuthenticated) {
    next({ name: "dashboard" });
  } else next();

  let isFilterEnable = to.meta.headerFiltersEnable;
  store.dispatch("isFilterEnableAction", isFilterEnable);
  Promise.all([store.dispatch(VERIFY_AUTH)]).then(next);

  // reset config to initial state
  store.dispatch(RESET_LAYOUT_CONFIG);

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

// global funcitons
Vue.mixin({
  methods: {
    cacheRefresh() {
      // await ApiService.get("/tweets/clearcache");
      return new Promise(resolve => {
        ApiService.get("/tweets/clearcache").then(() => {
          resolve({
            success: true,
            msg: "data has been syncronyzed"
          });
        });
      });
    }
  }
});

new Vue({
  Multiselect,
  DatePicker,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
