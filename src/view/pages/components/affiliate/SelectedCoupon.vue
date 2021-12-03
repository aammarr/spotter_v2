<template>
  <div class="card">
    <div class="card-body">
      <b-skeleton-table
        v-if="isLoading"
        :rows="5"
        :columns="5"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
      <b-table
        v-if="!isLoading"
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
    </div>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";

export default {
  name: "selected-coupon",
  data() {
    return {
      code: this.$route.query.code,
      date_from: this.$route.query.from,
      date_to: this.$route.query.to,
      isLoading: false,
      current_page: "1",
      per_page: "",
      total_records: "",
      from: "",
      to: "",
      tableData: [],
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
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: this.code }]);
    this.searchTweets(this.code);
  },
  methods: {
    searchTweets(coupon) {
      // this.selectedCoupon = coupon;
      this.isLoading = true;
      // this.isCouponSubmitted = false;
      let dataToPost = {
        name: coupon,
        date_from: this.date_from,
        date_to: this.date_to,
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
    },
    handlePagination(value) {
      this.current_page = value;
      this.searchTweets(this.code);
    }
  }
};
</script>
