import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/view/layout/Layout"),
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/view/pages/Dashboard.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "Dashboard"
          }
        },
        {
          path: "/metrics",
          name: "metrics",
          component: () =>
            import("@/view/pages/components/metrics/Metrics.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Metrics"
          }
        },
        {
          path: "/addcoupon",
          name: "addcoupon",
          component: () =>
            import("@/view/pages/components/coupons/AddCoupon.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Add Coupon"
          }
        },
        {
          path: "/searchcoupon",
          name: "searchcoupon",
          component: () =>
            import("@/view/pages/components/coupons/SearchCoupon.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Search Coupon"
          }
        },
        {
          path: "/keyword",
          name: "keyword",
          component: () =>
            import("@/view/pages/components/coupons/Keyword.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Keyword"
          }
        },
        {
          path: "/validtweets",
          name: "validtweets",
          component: () =>
            import("@/view/pages/components/tweets/ValidTweets.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "Valid Tweets"
          }
        },
        {
          path: "/spamtweets",
          name: "spamtweets",
          component: () =>
            import("@/view/pages/components/tweets/SpamTweets.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "Span Tweets"
          }
        },
        {
          path: "/addtweets",
          name: "addtweets",
          component: () =>
            import("@/view/pages/components/tweets/AddTweets.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "Add Tweets"
          }
        },
        {
          path: "/alltweets",
          name: "alltweets",
          component: () =>
            import("@/view/pages/components/tweets/AllTweets.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "All Tweets"
          }
        },
        {
          path: "/addclients",
          name: "addclients",
          component: () =>
            import("@/view/pages/components/clients/AddClients.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Add Clients"
          }
        },
        {
          path: "/searchclients",
          name: "searchclients",
          component: () =>
            import("@/view/pages/components/clients/SearchClients.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Search Clients"
          }
        }
      ]
    },
    {
      path: "/",
      component: () => import("@/view/pages/auth/Auth"),
      children: [
        {
          name: "login",
          path: "/login",
          component: () => import("@/view/pages/auth/Login"),
          meta: {
            headerFiltersEnable: false,
            restricted: true
          }
        },
        {
          name: "register",
          path: "/register",
          component: () => import("@/view/pages/auth/Register"),
          meta: {
            headerFiltersEnable: false,
            restricted: true
          }
        },
        {
          name: "forgotpassword",
          path: "/forgotpassword",
          component: () => import("@/view/pages/auth/ForgotPassword"),
          meta: {
            headerFiltersEnable: false,
            restricted: true
          }
        },
        {
          name: "newpassword",
          path: "/password/reset",
          component: () => import("@/view/pages/auth/NewPassword"),
          meta: {
            headerFiltersEnable: false,
            restricted: true
          }
        }
      ]
    },
    {
      path: "*",
      redirect: "/404"
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/view/pages/error/Error-1.vue")
    }
  ]
});
