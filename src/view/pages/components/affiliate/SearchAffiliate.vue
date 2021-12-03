<template>
  <div>
    <div class="d-flex justify-content-end TopMargin">
      <!-- {{ date_from }} {{ selected_coupon }} -->
      <date-picker
        placeholder="Date From"
        input-class="form-control date_picker_height"
        :lang="lang"
        :config="options"
        v-model="date_from"
        confirm
        format="DD-MM-YYYY"
        value-type="YYYY-MM-DD"
        class="ml-2"
        style="width:20%"
      ></date-picker>
      <date-picker
        placeholder="Date To"
        input-class="form-control date_picker_height"
        :lang="lang"
        :config="options"
        v-model="date_to"
        confirm
        format="DD-MM-YYYY"
        value-type="YYYY-MM-DD"
        class="ml-2"
        style="width:20%"
      ></date-picker>
      <multiselect
        v-model="selected_coupon"
        :options="allCoupons"
        class="multiselectcustomclass ml-2"
        selectLabel="select"
        deselectLabel="remove"
        :preserve-search="true"
        :maxHeight="200"
        placeholder="Coupons"
        :multiple="true"
        style="width:25%"
      >
      </multiselect>
      <div class="ml-2">
        <button
          v-if="isFilter"
          type="button"
          class="btn btn-danger mr-2"
          @click="removeFilter"
        >
          <!-- v-if="isFilterApplied" -->
          Remove Filters
        </button>
        <button
          type="button"
          class="btn btn-info"
          @click="applyFilter"
          :disabled="!(date_from || date_to || selected_coupon)"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <b-card v-if="isLoading" class="mt-3">
      <b-skeleton-table
        :rows="5"
        :columns="6"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
    </b-card>
    <b-card v-if="!isLoading" class="mt-3" style="min-height: 350px">
      <h3 class="card-title" style="font-weight: 600">
        Affiliate Coupon Spams
      </h3>
      <b-table
        :items="tableData"
        :fields="fields"
        head-variant="light dark"
        show-empty
        borderless
        @row-selected="onRowSelected"
      >
        <template v-slot:cell(sr)="row">
          {{ tableData.indexOf(row.item) + 1 }}
        </template>
        <template v-slot:cell(coupon_code)="row">
          <router-link
            :to="
              '/selectedCoupon?code=' +
                row.item.coupon_code +
                '&from=' +
                (date_from ? date_from : '') +
                '&to=' +
                (date_to ? date_to : '')
            "
            ><span class="link">
              {{ row.item.coupon_code }}
            </span></router-link
          >
        </template>
        <template v-slot:cell(order)="row">
          <b>{{ row.item.order_count }}</b>
        </template>
        <template v-slot:cell(revenue)="row">
          <b>{{ row.item.revenue }}</b>
        </template>
        <template v-slot:cell(commission)="row">
          <b>{{ row.item.commission }}</b>
        </template>
        <template v-slot:cell(spam)="row">
          <b>{{ row.item.frequency_of_spam }}</b>
        </template>
      </b-table>

      <div class="d-flex justify-content-between" v-if="tableData.length > 0">
        <b-pagination
          v-model="current_page"
          :total-rows="total_records"
          :per-page="per_page.val"
          aria-controls="tableHorizontal"
          @change="handlePagination"
        ></b-pagination>
        <div class="font-size-sm" v-if="total_records > 25">
          {{ `Showing ${per_page.val} of ${total_records}` }}
        </div>
        <div class="font-size-sm" v-if="total_records < 25">
          {{ `Showing ${total_records} of ${total_records}` }}
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";

export default {
  name: "searchaffiliates",
  data() {
    return {
      isLoading: false,
      current_page: 1,
      per_page: { val: 25, label: "25" },
      total_records: "",
      isFilter: false,
      date_from: null,
      date_to: null,
      selected_coupon: null,
      lang: "en",
      options: {
        format: "DD/MM/YYYY",
        useCurrent: false
      },
      keyword: [],
      keywordError: false,
      keywordsArray: [],
      fields: [
        {
          key: "sr",
          label: "Sr. No",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "coupon_code",
          label: "Coupon Code",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "order",
          label: "Order",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "revenue",
          label: "Revenue",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "commission",
          label: "Commission",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "spam",
          label: "Spam",
          thStyle: { minWidth: "15%" }
        }
      ],
      tableData: [],
      selected: [],
      singleSelectedRowID: "",
      allCoupons: []
    };
  },
  created() {
    this.appUserAction;
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Affiliate" }]);
    this.getAllCoupons();
    this.getData();
  },
  methods: {
    /**
     * onRowSelected function
     */
    getData() {
      this.isLoading = true;
      let dataToPost = {
        start_date: this.date_from,
        end_date: this.date_to,
        coupons: this.selected_coupon,
        page: this.current_page,
        // per_page: "25"
        limit: "25"
      };
      ApiService.post(`/getfrequencyofcoupon`, dataToPost).then(response => {
        this.tableData = response.data.data.data;
        this.total_records = response.data.data.total;

        this.isLoading = false;
      });
    },
    onRowSelected(items) {
      this.selected = items;
    },
    /**
     * handlePagination function
     */
    handlePagination(value) {
      this.current_page = value;
      this.getData();
    },
    /**
     * getAllCoupons function
     */
    getAllCoupons() {
      ApiService.get(`/coupons/getallcoupons`).then(response => {
        this.allCoupons = response.data.data;
      });
    },

    applyFilter() {
      this.isFilter = true;
      this.current_page = 1;
      this.getData();
      // Note also set te pagination here
    },
    removeFilter() {
      this.date_from = null;
      this.date_to = null;
      this.selected_coupon = null;
      this.isFilter = false;
      this.getData();
    }
  }
};
</script>
<style scoped>
.img_hw {
  height: 100px;
  width: 100px;
}
.multiselectcustomclass {
  font-size: 9px !important;
}
.filtersTopRightCorner {
  display: flex;
  position: absolute;
  right: 25px;
  top: 85px;
}
.date_picker_height {
  height: 43px;
  border-radius: 10px;
}
.link {
  cursor: pointer;
}
.link:hover {
  color: #4e8cff;
  font-weight: 800;
  text-decoration-line: underline;
  font-style: italic;
}
</style>
