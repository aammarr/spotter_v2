/* eslint-disable prettier/prettier */
<template>
  <div>
    <b-navbar
      class="container-fluid"
      toggleable="lg"
      type="dark"
      variant="info"
    >
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <!-- LOGO -->
      <router-link to="/">
        <img
          src="/./media/images/spotter_logos/Spotter-MainLogo.png"
          alt="Logo"
          class="max-h-30px"
        />
      </router-link>
      <!-- LOGO -->
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="w-50 p-3">
          <b-nav-item href="#"
            ><router-link
              to="/"
              class="font-size-lg font-weight-bold text-white mr-8"
            >
              Dashboard</router-link
            >
          </b-nav-item>

          <b-nav-item href="#"
            ><router-link
              to="/metrics"
              class="font-size-lg font-weight-bold text-white mr-8"
            >
              Metrics</router-link
            >
          </b-nav-item>
          <!-- Dashboard Api's Only -->
          <!-- <b-nav-item href="#"
            ><router-link
              to="/api_only"
              class="font-size-lg font-weight-bold text-white mr-8"
            >
              Dashboard Api's Only</router-link
            >
          </b-nav-item> -->

          <!-- Dashboard UI Only -->
          <!-- <b-nav-item href="#"
            ><router-link
              to="/layout_only"
              class="font-size-lg font-weight-bold text-white mr-8"
            >
              Dashboard UI Only</router-link
            >
          </b-nav-item> -->
        </b-navbar-nav>
        <b-navbar-nav class="w-50">
          <div class="w-100 d-flex justify-content-end align-items-center mr-3">
            <!-- Search Input -->
            <multiselect
              id="english_name"
              v-model="searchFieldValue"
              class="mr-2"
              placeholder="Search"
              select-label="Go To..."
              :options="routerPaths"
              label="name"
              track-by="route"
              :max-height="150"
              @input="onSearch"
              style="width: 300px; font-size:12px"
              @close="onSearchClose"
            ></multiselect>
            <!-- <b-form-input
              class="mr-2"
              v-model="searchFieldValue"
              type="text"
              placeholder="Search..."
              style="width: 400px"
            ></b-form-input> -->
            <img
              src="media/images/nav_icons/icon_header_search.svg"
              style="height: 25px; width: 25px"
              v-b-tooltip.hover.left="'Search'"
            />
          </div>

          <!-- Search Btn -->
          <!-- <b-nav-item>
            <img
              src="media/images/nav_icons/icon_header_search.svg"
              class="mr-4"
              style="height: 25px; width: 25px"
              v-b-tooltip.hover.left="'Search'"
            />
          </b-nav-item> -->
          <!-- <b-nav-item>
            <b-icon
              icon="arrow-repeat"
              variant="light"
              v-b-tooltip.hover.left="'Sync Data'"
              scale="2"
              @click="syncData"
            ></b-icon>
          </b-nav-item> -->
        </b-navbar-nav>
      </b-collapse>
      <div id="container" class="ml-4">
        <button
          type="button"
          :class="
            applicationUser == null
              ? 'spinner spinner-light spinner-center btn'
              : 'btn'
          "
          id="user_dropdown"
          tabindex="0"
          style="
            background: #b5caff;
            color: #ffffff;
            font-weight: 500;
            min-height: 40px;
            min-width: 100px;
          "
        >
          {{
            applicationUser
              ? "Hi, " + applicationUser.data.firstname.split(" ")[0]
              : ""
          }}
        </button>
        <b-popover
          :show.sync="show"
          target="user_dropdown"
          placement="bottomleft"
          container="container"
          triggers="focus"
        >
          <template>
            <div class="card-body p-0" style="min-width: 200px">
              <div class="d-flex justify-content-start align-items-center">
                <img
                  :src="
                    applicationUser ? applicationUser.data.profile_picture : ''
                  "
                  style="
                    height: 50px;
                    width: 50px;
                    border: 1px transparent;
                    border-radius: 100%;
                  "
                />
                <div>
                  <p class="m-0 ml-2" style="font-size: 15px; font-weight: 500">
                    {{ applicationUser ? applicationUser.data.firstname : "" }}
                  </p>
                  <p class="m-0 ml-2 text-muted">
                    {{ applicationUser ? applicationUser.data.email : "" }}
                  </p>
                </div>
              </div>
              <div class="mt-3">
                <router-link
                  to="/logs"
                  class="text-info btn bg-light-success btn-sm btn-block"
                >
                  Logs
                </router-link>
                <router-link
                  to="/user-profile"
                  class="text-info btn bg-light-success btn-sm btn-block"
                >
                  View Profile
                </router-link>
                <router-link
                  to="/account-setting"
                  class="text-info btn bg-light-success btn-sm btn-block"
                >
                  Account Settings
                </router-link>
                <button
                  type="button"
                  class="btn bg-light-danger text-danger btn-sm btn-block"
                  @click="onLogout"
                >
                  Logout
                </button>
              </div>
            </div>
          </template>
        </b-popover>
      </div>
    </b-navbar>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
import router from "@/router";
export default {
  name: "topnav",
  // eslint-disable-next-line vue/no-unused-components
  components: { router },
  data() {
    return {
      applicationUser: null,
      isSearchFieldEnabled: false,
      searchFieldValue: "",
      show: false,
      routerPaths: []
    };
  },
  created() {
    this.appUserAction;
  },
  computed: {
    ...mapActions(["appUserAction"]),
    ...mapGetters(["appUserGetter"])
  },
  watch: {
    appUserGetter(newValue) {
      if (newValue) {
        this.applicationUser = newValue;
      }
    }
  },
  mounted() {
    router.getRoutes().forEach(rout => {
      if (rout.meta.navSearchName) {
        this.routerPaths.push({
          name: rout.meta.navSearchName,
          route: rout.name
        });
      }
    });
    //  Sort by Alpha Order
    this.routerPaths.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  },
  methods: {
    onLogout() {
      this.$store
        .dispatch(LOGOUT)
        .then(() => this.$router.push({ name: "login" }));
    },
    onSearch() {
      this.$router.push({ name: this.searchFieldValue.route });
    },
    onSearchClose() {
      this.searchFieldValue = null;
    }
  }
};
</script>
