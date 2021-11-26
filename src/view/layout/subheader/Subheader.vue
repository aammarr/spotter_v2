<template>
  <div
    class="subheader py-3 py-lg-3 subheader-transparent"
    v-bind:class="subheaderClasses"
    id="kt_subheader"
  >
    <div
      class="
        d-flex
        align-items-center
        justify-content-between
        flex-wrap flex-sm-nowrap
      "
      v-bind:class="{ 'container-fluid': widthFluid, container: !widthFluid }"
    >
      <div class="d-flex align-items-baseline mr-5" style="z-index: 9;">
        <h2 class="subheader-title text-dark font-weight-bolder my-2 mr-3 ml-2">
          {{ title }}
        </h2>
        <div class="ml-2">
          <b-icon
            v-if="title == 'Dashboard'"
            icon="arrow-repeat"
            variant="dark"
            scale="2"
            style="cursor: pointer;"
            @click="refresh"
          ></b-icon>
        </div>
        <ul
          class="
            breadcrumb breadcrumb-transparent breadcrumb-dot
            font-weight-bold
            my-2
            p-0
          "
        >
          <li
            v-for="(breadcrumb, i) in breadcrumbs"
            :key="`${i}-${breadcrumb.id}`"
            class="breadcrumb-item"
          >
            <router-link
              :key="`${i}-${breadcrumb.id}`"
              v-if="breadcrumb.route"
              :to="breadcrumb.route"
              class="text-muted"
            >
              {{ breadcrumb.title }}
            </router-link>
            <!-- <span
                class="text-muted"
                :key="`${i}-${breadcrumb.id}`"
                v-if="!breadcrumb.route"
              >
                {{ breadcrumb.title }}
              </span> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import headerdropdowns from "../subheader/HeaderDropdowns";
export default {
  name: "KTSubheader",
  // components: { headerdropdowns },
  props: {
    breadcrumbs: Array,
    title: String
  },
  computed: {
    ...mapActions(["setIsSyncAction"]),
    ...mapGetters(["layoutConfig"]),
    /**
     * Check if subheader width is fluid
     */
    widthFluid() {
      return this.layoutConfig("subheader.width") !== "fluid";
    },

    subheaderClasses() {
      const classes = [];
      const style = this.layoutConfig("subheader.style");
      if (style) {
        classes.push(style);

        if (style === "solid") {
          classes.push("bg-white");
        }

        if (this.layoutConfig("subheader.fixed")) {
          classes.push("border-top");
        }

        if (this.layoutConfig("subheader.clear")) {
          classes.push("mb-0");
        }
      }
      return classes.join(" ");
    }
  },
  methods: {
    // this is refresh data on dashboard sreen
    refresh() {
      this.$store.dispatch("setIsSyncAction", true);
    }
  }
};
</script>
