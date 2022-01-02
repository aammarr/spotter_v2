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
          path: "/add-coupon",
          name: "addcoupon",
          component: () =>
            import("@/view/pages/components/coupons/AddCoupon.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Add Coupon"
          }
        },
        {
          path: "/search-coupon",
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
          path: "/valid-tweets",
          name: "validtweets",
          component: () =>
            import("@/view/pages/components/tweets/ValidTweets.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "Valid Tweets"
          }
        },
        {
          path: "/spam-tweets",
          name: "spamtweets",
          component: () =>
            import("@/view/pages/components/tweets/SpamTweets.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "Span Tweets"
          }
        },
        {
          path: "/add-tweets",
          name: "addtweets",
          component: () =>
            import("@/view/pages/components/tweets/AddTweets.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "Add Tweets"
          }
        },
        {
          path: "/all-tweets",
          name: "alltweets",
          component: () =>
            import("@/view/pages/components/tweets/AllTweets.vue"),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "All Tweets"
          }
        },
        {
          path: "/add-clients",
          name: "addclients",
          component: () =>
            import("@/view/pages/components/clients/AddClients.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Add Clients"
          }
        },
        {
          path: "/search-clients",
          name: "searchclients",
          component: () =>
            import("@/view/pages/components/clients/SearchClients.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Search Clients"
          }
        },
        {
          path: "/pdf-report",
          name: "pdfreport",
          component: () =>
            import("@/view/pages/components/reports/PdfReport.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "PDF Report"
          }
        },
        {
          path: "/add-username",
          name: "addvalidusername",
          component: () =>
            import(
              "@/view/pages/components/tweet_authors/AddValidUserName.vue"
            ),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Add valid Username"
          }
        },
        {
          path: "/delete-username",
          name: "deletevalidusername",
          component: () =>
            import(
              "@/view/pages/components/tweet_authors/DeleteValidUserName.vue"
            ),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Delete Valid Username"
          }
        },
        {
          path: "/all-frequentspammers",
          name: "allfrequentspammers",
          component: () =>
            import(
              "@/view/pages/components/tweet_authors/AllFrequentSpammers.vue"
            ),
          meta: {
            headerFiltersEnable: true,
            navSearchName: "All Frequent Spammers"
          }
        },
        {
          path: "/affiliates",
          name: "searchaffiliates",
          component: () =>
            import("@/view/pages/components/affiliate/SearchAffiliate.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Search Affiliate"
          }
        },
        {
          path: "/selected-Coupon",
          name: "selectedCoupon",
          props: route => ({ query: route.query.q }),
          component: () =>
            import("@/view/pages/components/affiliate/SelectedCoupon.vue"),
          meta: {
            headerFiltersEnable: false
          }
        },
        {
          path: "/ocr",
          name: "ocr",
          component: () => import("@/view/pages/components/ocr/OCR.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "OCR"
          }
        },
        {
          path: "/landmark",
          name: "landmark",
          component: () =>
            import("@/view/pages/components/landmark/Landmark.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Land Mark"
          }
        },
        {
          path: "/user-profile",
          name: "userprofile",
          component: () =>
            import("@/view/pages/components/settings/Profile.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "User Profile"
          }
        },
        {
          path: "/account-setting",
          name: "accountsetting",
          component: () =>
            import("@/view/pages/components/settings/AccountSetting.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Account Setting"
          }
        },
        {
          path: "/logs",
          name: "logs",
          component: () => import("@/view/pages/components/settings/Logs.vue"),
          meta: {
            headerFiltersEnable: false,
            navSearchName: "Logs"
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
