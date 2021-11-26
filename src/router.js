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
