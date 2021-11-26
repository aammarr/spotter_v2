<template>
  <div
    class="aside aside-left d-flex aside-fixed"
    id="kt_aside"
    ref="kt_aside"
    :style="toggle_aside ? '' : 'position:absolute'"
  >
    <span
      class="aside-toggle btn btn-icon btn-info btn-hover-info"
      data-container="body"
      data-boundary="window"
      id="kt_aside_toggle"
      ref="kt_aside_toggle"
      @click="toggleClass"
    >
      <i class="fa fa-angle-left angle-icon"></i>
    </span>
    <div
      class="aside-primary d-flex flex-column align-items-center flex-row-auto"
    >
      <div
        class="aside-nav d-flex flex-column align-items-center flex-column-fluid py-5 scroll scroll-pull ps"
        style="height: 528px; overflow: hidden"
      >
        <ul class="nav flex-column" role="tablist">
          <li
            class="nav-item mb-3"
            data-placement="right"
            data-container="body"
            data-boundary="window"
            v-b-tooltip.hover.right="'Coupons'"
          >
            <a
              href="#"
              class="nav-link btn btn-icon btn-clean btn-lg"
              data-toggle="tab"
              v-on:click="setActiveTab"
              data-tab="0"
            >
              <img
                class="aside_main_icons"
                src="media/images/updated_menu_icons/icon_coupons.svg"
              />
            </a>
          </li>

          <li
            class="nav-item mb-3"
            data-placement="right"
            data-container="body"
            data-boundary="window"
            v-b-tooltip.hover.right="'Reports'"
          >
            <a
              href="#"
              class="nav-link btn btn-icon btn-clean btn-lg"
              data-toggle="tab"
              v-on:click="setActiveTab"
              data-tab="2"
            >
              <img
                class="aside_main_icons"
                src="media/images/updated_menu_icons/icon_reports.svg"
              />
            </a>
          </li>
          <li
            class="nav-item mb-3"
            data-placement="right"
            data-container="body"
            data-boundary="window"
            v-b-tooltip.hover.right="'Tweets'"
          >
            <a
              href="#"
              class="nav-link btn btn-icon btn-clean btn-lg"
              data-toggle="tab"
              v-on:click="setActiveTab"
              data-tab="3"
            >
              <img
                class="aside_main_icons"
                src="media/images/updated_menu_icons/icon_tweets.svg"
              />
            </a>
          </li>
          <li
            class="nav-item mb-3"
            data-placement="right"
            data-container="body"
            data-boundary="window"
            v-b-tooltip.hover.right="'Clients'"
          >
            <a
              href="#"
              class="nav-link btn btn-icon btn-clean btn-lg"
              data-toggle="tab"
              v-on:click="setActiveTab"
              data-tab="4"
            >
              <img
                class="aside_main_icons"
                src="media/images/updated_menu_icons/icon_clients.svg"
              />
            </a>
          </li>
          <li
            class="nav-item mb-3"
            data-placement="right"
            data-container="body"
            data-boundary="window"
            v-b-tooltip.hover.right="'Tweet Authors'"
          >
            <a
              href="#"
              class="nav-link btn btn-icon btn-clean btn-lg"
              data-toggle="tab"
              v-on:click="setActiveTab"
              data-tab="5"
            >
              <img
                class="aside_main_icons"
                src="media/images/updated_menu_icons/icon_authors.svg"
              />
            </a>
          </li>
          <li
            class="nav-item mb-3"
            data-placement="right"
            data-container="body"
            data-boundary="window"
            v-b-tooltip.hover.right="'Affiliates'"
          >
            <a
              href="#"
              class="nav-link btn btn-icon btn-clean btn-lg"
              data-toggle="tab"
              v-on:click="setActiveTab"
              data-tab="6"
            >
              <img
                class="aside_main_icons"
                src="media/images/updated_menu_icons/icon_affiliates_1.svg"
              />
            </a>
          </li>
        </ul>
      </div>

      <div
        class="aside-footer d-flex flex-column align-items-center flex-column-auto py-4 py-lg-10"
      >
      </div>
    </div>

    <div class="aside-secondary d-flex flex-row-fluid">
      <div
        class="aside-workspace scroll scroll-push my-2 ps"
        style="height: 824px; overflow: hidden"
      >
        <b-tabs class="hide-tabs" v-model="tabIndex">
          <b-tab active class="p-3 px-lg-7 py-lg-5">
            <h3 class="p-2 p-lg-3 my-1 my-lg-3">Coupons</h3>
            <div class="list list-hover">
              <perfect-scrollbar
                class="aside-menu scroll"
                style="max-height: 90vh; position: relative"
              >
                Coupons Menu
              </perfect-scrollbar>
            </div>
          </b-tab>
          <b-tab class="p-3 px-lg-7 py-lg-5">
            <h3 class="p-2 p-lg-3 my-1 my-lg-3">Reports</h3>

            <div class="list list-hover">
              <perfect-scrollbar
                class="aside-menu scroll"
                style="max-height: 90vh; position: relative"
              >
               Report Menu
              </perfect-scrollbar>
            </div>
          </b-tab>

          <b-tab class="p-3 px-lg-7 py-lg-5">
            <h3 class="p-2 p-lg-3 my-1 my-lg-3">Tweets</h3>
            <div class="list list-hover">
              <perfect-scrollbar
                class="aside-menu scroll"
                style="max-height: 90vh; position: relative"
              >
               Tweets Menu
              </perfect-scrollbar>
            </div>
          </b-tab>

          <b-tab class="p-3 px-lg-7 py-lg-5">
            <h3 class="p-2 p-lg-3 my-1 my-lg-3">Cients</h3>

            <div class="list list-hover">
              <perfect-scrollbar
                class="aside-menu scroll"
                style="max-height: 90vh; position: relative"
              >
                Cients Menu
              </perfect-scrollbar>
            </div>
          </b-tab>

          <b-tab class="p-3 px-lg-7 py-lg-5">
            <h3 class="p-2 p-lg-3 my-1 my-lg-3">Tweet Author</h3>

            <div class="list list-hover">
              <perfect-scrollbar
                class="aside-menu scroll"
                style="max-height: 90vh; position: relative"
              >
               Tweet Author Menu
              </perfect-scrollbar>
            </div>
          </b-tab>
          <b-tab class="p-3 px-lg-7 py-lg-5">
            <h3 class="p-2 p-lg-3 my-1 my-lg-3">Affiliates</h3>

            <div class="list list-hover">
              <perfect-scrollbar
                class="aside-menu scroll"
                style="max-height: 90vh; position: relative"
              >
               Affiliate Menu
              </perfect-scrollbar>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
/* hide default vue-bootstrap tab links */
.hide-tabs > div:not(.tab-content) {
  display: none;
}
</style>

<script>
import { mapGetters } from "vuex";
import KTLayoutAside from "@/assets/js/layout/base/aside.js";
import KTLayoutAsideMenu from "@/assets/js/layout/base/aside-menu.js";
import KTLayoutAsideToggle from "@/assets/js/layout/base/aside-toggle.js";
import {
  ADD_BODY_CLASSNAME,
  REMOVE_BODY_CLASSNAME
} from "@/core/services/store/htmlclass.module.js";
export default {
  name: "KTAside",
  data() {
    return {
      insideTm: 0,
      outsideTm: 0,
      tabIndex: 0,
      toggle_aside: false,
      lockAside: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      // Init Aside
      KTLayoutAside.init(this.$refs["kt_aside"]);

      // Init Aside Menu
      KTLayoutAsideMenu.init(this.$refs["kt_aside_menu"]);

      // Init Aside Toggle
      KTLayoutAsideToggle.init(this.$refs["kt_aside_toggle"]);
    });
  },
  methods: {
    toggleClass() {
      this.toggle_aside = !this.toggle_aside;
      this.$emit("toggle", this.toggle_aside);
    },
    showAside() {
      this.$store.dispatch(REMOVE_BODY_CLASSNAME, "aside-minimize");
    },
    hideAside() {
      if (!this.lockAside) {
        this.$store.dispatch(ADD_BODY_CLASSNAME, "aside-minimize");
      }
    },
    setActiveTab(event) {
      let target = event.target;
      if (!event.target.classList.contains("nav-link")) {
        target = event.target.closest(".nav-link");
      }

      const tab = target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set clicked tab index to bootstrap tab
      this.tabIndex = parseInt(target.getAttribute("data-tab"));

      // set current active tab
      target.classList.add("active");
    }
  },
  computed: {
    ...mapGetters(["layoutConfig", "getClasses"]),

    /**
     * Get extra classes for menu based on the options
     */
    asideMenuClass() {
      const classes = this.getClasses("aside_menu");
      if (typeof classes !== "undefined") {
        return classes.join(" ");
      }
      return null;
    }
  }
};
</script>
<style scoped>
.aside_main_icons {
  height: 30px;
  width: 30px;
}
.angle-icon{
  font-size: 1.5em;
}
</style>
