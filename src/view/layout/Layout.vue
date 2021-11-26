<template>
  <div class="d-flex flex-column flex-root" v-if="isAuthenticated">
    <Header></Header>

    <Loader v-if="loaderEnabled" v-bind:logo="loaderLogo"></Loader>
    <div>
      <topnav></topnav>
    </div>
    <div
      :class="
        'd-flex flex-row flex-column-fluid page' +
          (toggle_aside ? '' : ' pl-30')
      "
      style="position:relative"
    >
      <SideMenu v-if="asideEnabled" @toggle="toggleClass"></SideMenu>

      <div
        id="kt_wrapper"
        class="d-flex flex-column flex-row-fluid wrapper pl-0"
      >
        <div
          id="kt_content"
          class="content d-flex flex-column flex-column-fluid"
        >
          <SubHeader
            v-if="subheaderDisplay"
            v-bind:breadcrumbs="breadcrumbs"
            v-bind:title="pageTitle"
          />
          <div class="container-fluid">
            <headerdropdowns v-show="isFilterEnable"></headerdropdowns>
          </div>

          <div class="d-flex flex-column-fluid">
            <div
              :class="{
                'container-fluid': !contentFluid,
                container: contentFluid
              }"
            >
              <transition name="fade-in-up">
                <router-view />
              </transition>
              <chatbubble />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
    <ScrollTop></ScrollTop>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SideMenu from "@/view/layout/aside/Aside.vue";
import Header from "@/view/layout/header/HeaderMobile.vue";
import SubHeader from "@/view/layout/subheader/Subheader.vue";
import Footer from "@/view/layout/footer/Footer.vue";
import HtmlClass from "@/core/services/htmlclass.service";
import headerdropdowns from "@/view/layout/subheader/HeaderDropdowns.vue";
import topnav from "@/view/layout/subheader/TopNav.vue";
import ScrollTop from "@/view/layout/extras/ScrollTop";
import Loader from "@/view/content/Loader.vue";
import {
  ADD_BODY_CLASSNAME,
  REMOVE_BODY_CLASSNAME
} from "@/core/services/store/htmlclass.module.js";
import chatbubble from "./ChatBubble";
export default {
  name: "Layout",
  components: {
    SideMenu,
    Header,
    SubHeader,
    Footer,
    headerdropdowns,
    topnav,
    chatbubble,
    ScrollTop,
    Loader
  },
  data() {
    return {
      toggle_aside: false
    };
  },
  beforeMount() {
    this.$store.dispatch(ADD_BODY_CLASSNAME, "page-loading");
    HtmlClass.init(this.layoutConfig());
  },
  mounted() {
    if (this.isTokenExpiredGetter) {
      this.showMsg();
    }
    if (!this.isAuthenticated) {
      this.$router.push({ name: "login" });
    }
    setTimeout(() => {
      this.$store.dispatch(REMOVE_BODY_CLASSNAME, "page-loading");
    }, 2000);
  },
  methods: {
    toggleClass(val) {
      this.toggle_aside = val;
      // this.$forceUpdate();
    },
    showMsg() {
      this.$swal
        .fire({
          icon: "error",
          title: "Your session has expired!",
          text: "Please login to continue",
          confirmButtonText: "Go to login page",
          allowOutsideClick: false,
          allowEscapeKey: false
        })
        .then(result => {
          if (result.isConfirmed) {
            this.$router.push({ name: "login" });
          }
        });
    },
    hideAside() {
      this.$store.dispatch(ADD_BODY_CLASSNAME, "aside-minimize");
    }
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "breadcrumbs",
      "pageTitle",
      "layoutConfig",
      "isTokenExpiredGetter"
    ]),

    /**
     * Check if the page loader is enabled
     * @returns {boolean}
     */
    isFilterEnable() {
      return this.$store.getters.isFilterEnable;
    },
    loaderEnabled() {
      return !/false/.test(this.layoutConfig("loader.type"));
    },

    /**
     * Check if container width is fluid
     * @returns {boolean}
     */
    contentFluid() {
      return this.layoutConfig("content.width") === "fluid";
    },

    /**
     * Page loader logo image using require() function
     * @returns {string}
     */
    loaderLogo() {
      return process.env.BASE_URL + this.layoutConfig("loader.logo");
    },

    /**
     * Check if the left aside menu is enabled
     * @returns {boolean}
     */
    asideEnabled() {
      return !!this.layoutConfig("aside.self.display");
    },

    /**
     * Set the right toolbar display
     * @returns {boolean}
     */
    toolbarDisplay() {
      // return !!this.layoutConfig("toolbar.display");
      return true;
    },

    /**
     * Set the subheader display
     * @returns {boolean}
     */
    subheaderDisplay() {
      return !!this.layoutConfig("subheader.display");
    }
  },
  watch: {
    isTokenExpiredGetter(newValue) {
      if (newValue) {
        this.showMsg();
      }
    }
  }
};
</script>
