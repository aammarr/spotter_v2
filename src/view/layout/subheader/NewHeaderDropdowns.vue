<template>
  <div class="row TopMargin">
    <div class="col-md-12 mb-3">
      <div class="text-right">
        <!-- remove filter btn -->
        <button
          type="button"
          class="btn btn-danger mr-2"
          v-if="isFilterApplied"
          @click="removeFilters"
        >
          Remove Filters
        </button>
        <!-- apply filter btn -->
        <button type="button" class="btn btn-info" @click="applyFilters">
          Apply Filters
        </button>
      </div>
    </div>

    <!-- clients -->
    <div class="col-md-3">
      <div class="form-group">
        <multiselect
          v-model="selectedClients"
          :options="['English', 'Arabic']"
          class="multiselectcustomclass"
          selectLabel=""
          deselectLabel="remove"
          :multiple="true"
          :preserve-search="true"
          :maxHeight="200"
          placeholder="Language"
        >
          <!-- label="name"
          track-by="id" -->
          <!-- @input="setClientFilter" -->

          <template slot="selection" slot-scope="{ values, isOpen }"
            ><span
              class="multiselect__single"
              v-if="values.length &amp;&amp; !isOpen"
              >{{ values.length }} selected</span
            ></template
          >
        </multiselect>
      </div>
    </div>
    <!-- clients -->
    <div class="col-md-3">
      <div class="form-group">
        <multiselect
          v-model="selectedClients"
          :options="['USA', 'UAE', 'Pakistan']"
          class="multiselectcustomclass"
          selectLabel=""
          deselectLabel="remove"
          :multiple="true"
          :preserve-search="true"
          :maxHeight="200"
          placeholder="Country"
        >
          <!-- label="name"
          track-by="id" -->
          <!-- @input="setClientFilter" -->

          <template slot="selection" slot-scope="{ values, isOpen }"
            ><span
              class="multiselect__single"
              v-if="values.length &amp;&amp; !isOpen"
              >{{ values.length }} selected</span
            ></template
          >
        </multiselect>
      </div>
    </div>
    <!-- clients -->
    <div class="col-md-3">
      <div class="form-group">
        <multiselect
          v-model="selectedClients"
          :options="['Andriod', 'IOS']"
          class="multiselectcustomclass"
          selectLabel=""
          deselectLabel="remove"
          :multiple="true"
          :preserve-search="true"
          :maxHeight="200"
          placeholder="Device"
        >
          <!-- label="name"
          track-by="id" -->
          <!-- @input="setClientFilter" -->

          <template slot="selection" slot-scope="{ values, isOpen }"
            ><span
              class="multiselect__single"
              v-if="values.length &amp;&amp; !isOpen"
              >{{ values.length }} selected</span
            ></template
          >
        </multiselect>
      </div>
    </div>
    <!-- coupons -->
    <div class="col-md-3">
      <div class="form-group">
        <multiselect
          v-model="selectedCoupons"
          :options="['Domain 1', 'Domain 2']"
          class="multiselectcustomclass"
          selectLabel=""
          deselectLabel="remove"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          :maxHeight="200"
          placeholder="Domain"
        >
          <!-- label="coupon_name"
          track-by="id" -->
          <!-- @input="setCouponFilter" -->

          <template slot="selection" slot-scope="{ values, isOpen }"
            ><span
              class="multiselect__single"
              v-if="values.length &amp;&amp; !isOpen"
              >{{ values.length }} selected</span
            ></template
          >
        </multiselect>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "../../../core/services/api.service";
import { mapActions } from "vuex";

export default {
  name: "headerdropdowns",
  data() {
    return {
      lang: "en",
      allClients: [],
      allCoupons: [],
      selectedClients: [],
      selectedCoupons: [],
      startDate: null,
      endDate: null,
      options: {
        format: "DD/MM/YYYY",
        useCurrent: false,
      },
      isFilterApplied: false,
    };
  },
  mounted() {
    // this.getAllCoupons();
    // this.getAllClients();
  },
  methods: {
    ...mapActions(["setFiltersAction"]),
    validateFilters() {
      if (
        this.selectedClients.length ||
        this.selectedCoupons.length ||
        this.startDate ||
        this.endDate
      ) {
        return true;
      } else {
        return false;
      }
    },
    removeFilters() {
      // this.cacheRefresh();
      this.selectedClients = [];
      this.selectedCoupons = [];
      this.startDate = null;
      this.endDate = null;
      let filters = {
        clients: [],
        coupons: [],
        startDate: null,
        endDate: null,
      };
      this.setFiltersAction(filters);
      this.isFilterApplied = false;
    },
    applyFilters() {
      if (this.validateFilters()) {
        // this.cacheRefresh();
        let client_id_array = [];
        this.selectedClients.forEach((val) => {
          client_id_array.push(val.id);
        });
        let coupon_id_array = [];
        this.selectedCoupons.forEach((val) => {
          coupon_id_array.push(val.coupon_name);
        });
        let filters = {
          clients: client_id_array,
          coupons: coupon_id_array,
          date_from: this.startDate,
          date_to: this.endDate,
        };
        this.setFiltersAction(filters);
        this.isFilterApplied = true;
      }
    },

    getAllCoupons() {
      ApiService.get(`/coupons/getallcoupons`).then((response) => {
        let result = response.data.data;
        let allCoupons = [];
        if (result.length) {
          result.forEach((val) => {
            allCoupons.push({ id: val, coupon_name: val });
          });
        }
        this.allCoupons = allCoupons;
      });
    },
    getAllClients() {
      ApiService.get(`/clients/getallclients`).then((response) => {
        this.allClients = response.data.data.data;
      });
    },
  },
};
</script>
<style scoped>
.multiselectcustomclass {
  font-size: 11px !important;
}
.mx-datepicker {
  width: 100% !important;
}
</style>
