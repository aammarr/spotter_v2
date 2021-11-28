<template>
  <div>
    <b-card>
      <b-form class="form" @submit.stop.prevent="searchCoupon">
        <div class="col-md-6 p-0">
          <div class="row align-items-center">
            <div class="col-10">
              <b-form-group id="input-group-2">
                <label class="text-dark font-weight-bold" label-for="coupon"
                  >Enter Coupon</label
                >
                <b-form-input
                  class="form-control"
                  id="coupon"
                  name="coupon"
                  v-model="$v.form.coupon.$model"
                  :state="validateState('coupon')"
                  aria-describedby="input-0-live-feedback"
                ></b-form-input>
                <b-form-invalid-feedback id="input-0-live-feedback">
                  Coupon is required.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
            <div class="col-2">
              <b-button type="submit" variant="info">Submit</b-button>
            </div>
          </div>
        </div>
      </b-form>
      <b-skeleton-table
        v-if="isLoading"
        :rows="5"
        :columns="6"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
      <b-table
        v-if="!isLoading && isCouponSubmitted"
        id="tableHorizontal"
        class="table table-custom"
        :items="couponTableData"
        :fields="couponTableFields"
        head-variant="light dark"
        borderless
        show-empty
        small
      >
        <template v-slot:cell(action)="row">
          <b-icon
            icon="search"
            font-scale="2"
            variant="info"
            class="mr-2"
            style="cursor: pointer"
            :id="`tooltip_search_${row.index}`"
            @click="searchTweets(row.item.coupon)"
          ></b-icon>
          <b-tooltip
            :target="`tooltip_search_${row.index}`"
            triggers="hover"
            placement="right"
          >
            Search!
          </b-tooltip>
        </template>
      </b-table>
      <b-table
        v-if="!isLoading && !isCouponSubmitted"
        id="tableHorizontal"
        class="table table-custom"
        :items="tableData"
        :fields="fields"
        head-variant="light dark"
        borderless
        show-empty
        small
      >
      </b-table>
      <div
        class="d-flex justify-content-between"
        v-if="!isLoading && tableData.length"
      >
        <b-pagination
          v-model="current_page"
          :total-rows="total_records"
          :per-page="per_page"
          aria-controls="tableHorizontal"
          @change="handlePagination"
        ></b-pagination>
        <div class="font-size-sm">
          {{ `Showing ${from} to ${to}` }}
        </div>
      </div>
    </b-card>
    <div style="height: 200px; visibility: hidden"></div>
  </div>
</template>
<style lang="scss" scoped>
.spinner.spinner-right {
  padding-right: 3.5rem !important;
}
</style>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";
import { validationMixin } from "vuelidate";
import { required, alphaNum } from "vuelidate/lib/validators";
export default {
  name: "searchcoupon",
  mixins: [validationMixin],
  data() {
    return {
      isLoading: false,
      isCouponSubmitted: false,
      form: {
        coupon: ""
      },
      selectedCoupon: "",
      current_page: "1",
      per_page: "",
      total_records: "",
      from: "",
      to: "",
      tableData: [],
      couponTableData: [],
      couponTableFields: [
        {
          key: "s_no",
          label: "S.No",
          thStyle: { width: "220px", textAlign: "center" }
        },
        {
          key: "coupon",
          label: "Coupon",
          thStyle: { width: "220px", textAlign: "center" }
        },
        {
          key: "action",
          label: "Action",
          thStyle: { width: "220px", textAlign: "center" }
        }
      ],
      fields: [
        {
          key: "tweet_id",
          label: "TWEET ID",
          thStyle: { width: "220px", textAlign: "center" }
        },
        {
          key: "user_id",
          label: "USER ID",
          thStyle: { width: "220px", textAlign: "center" }
        },
        {
          key: "name",
          label: "NAME",
          thStyle: { width: "220px", textAlign: "center" }
        },
        {
          key: "text",
          label: "COUPON",
          thStyle: { width: "220px", textAlign: "center" }
        },
        {
          key: "tw_created_at",
          label: "TWEET TIME",
          thStyle: { width: "220px", textAlign: "center" }
        }
      ]
    };
  },
  validations: {
    form: {
      coupon: {
        required,
        alphaNum
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Search Coupon" }]);
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    handlePagination(value) {
      this.current_page = value;
      this.searchTweets(this.selectedCoupon);
    },
    searchCoupon() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.isLoading = true;
      this.isCouponSubmitted = true;
      this.tableData = [];
      this.total_records = "";
      let dataToPost = {
        search_string: this.form.coupon
      };
      ApiService.post(`/coupons/searchwithincoupon`, dataToPost).then(
        response => {
          let result = response.data.data;
          let couponTableData = [];
          if (result.length) {
            result.forEach((element, index) => {
              couponTableData.push({
                s_no: index + 1,
                coupon: element
              });
            });
          }
          this.couponTableData = couponTableData;
          this.isLoading = false;
        }
      );
    },
    searchTweets(coupon) {
      this.selectedCoupon = coupon;
      this.isLoading = true;
      this.isCouponSubmitted = false;
      let dataToPost = {
        name: coupon,
        page: this.current_page
      };
      ApiService.post(`/coupons/search`, dataToPost).then(response => {
        this.tableData = response.data.data.data;
        this.total_records = response.data.data.total;
        this.to = response.data.data.to;
        this.from = response.data.data.from;
        this.per_page = response.data.data.per_page;
        this.isLoading = false;
      });
    }
  }
};
</script>
