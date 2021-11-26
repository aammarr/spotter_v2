<template>
  <div class="card card-custom gutter-b" style="min-height: 418px">
    <div class="card-body p-0">
      <div
        class="
          d-flex
          align-items-center
          justify-content-between
          card-spacer
          flex-grow-1
        "
      >
        <div class="d-flex flex-column text-right">
          <span class="font-weight-bold mt-2">
            <h4 style="font-weight: bolder">Highest Total Spam</h4>
          </span>
        </div>
        <div class="d-flex justify-content-end">
          <b-form-select
            @change="fetchHighestTotalSpamData()"
            :disabled="disabledClient"
            v-model="selectedClient"
            class="m-2 w-50"
            :options="allClients"
            placeholder="Select"
          ></b-form-select>
          <b-form-select
            @change="fetchHighestTotalSpamData()"
            v-model="selectedPeriod"
            class="m-2 w-50"
            :options="allPeriods"
            label="name"
            placeholder="Select"
          ></b-form-select>
        </div>
      </div>
      <div class="card-body p-0 text-center p-10" v-if="isLoading">
        <b-spinner
          style="width: 5rem; height: 5rem"
          label="Large Spinner"
        ></b-spinner>
      </div>
      <apexchart
        v-if="!isLoading"
        :options="options"
        :series="series"
        type="area"
        height="300px"
      ></apexchart>
    </div>
  </div>
</template>
<script>
import ApiService from "../../../../../core/services/api.service";
import { mapGetters } from "vuex";

export default {
  name: "spamtweetstrends",
  props: ["pre_data"],
  data() {
    return {
      options: this.pre_data.options,
      series: this.pre_data.series,
      isLoading: this.pre_data.isLoading,
      allClients: [],
      selectedClient: null,
      disabledClient: false,
      selectedPeriod: "7days",
      disabledPeriod: false,
      allPeriods: [
        {
          value: "7days",
          text: "Last 7 Days"
        },
        {
          value: "1month",
          text: "Last Month"
        },
        {
          value: "6month",
          text: "Last 6 Months"
        }
      ]
    };
  },

  computed: {
    ...mapGetters(["layoutConfig"]),
    filtersGetter: function() {
      return this.$store.getters.filtersGetter;
    }
  },

  watch: {
    pre_data: function(newVal) {
      if (newVal) {
        this.series = this.pre_data.series;
        this.options = this.pre_data.options;
        this.isLoading = this.pre_data.isLoading;
      }
    },
    filtersGetter(newValue) {
      if (newValue) {
        if (newValue.clients > 0) {
          this.selectedClient = null;
          this.disabledClient = true;
        } else {
          this.selectedClient = null;
          this.disabledClient = false;
        }
      }
    }
  },
  created() {
    this.getAllClients();
  },
  methods: {
    fetchHighestTotalSpamData() {
      this.isLoading = true;
      let dataToPost = {
        clients: this.selectedClient
          ? [this.selectedClient]
          : this.filtersGetter.clients,
        period: this.selectedPeriod
      };
      ApiService.post(`/totaltweetcountpast7days`, dataToPost).then(
        response => {
          let series = [];
          let spam_tweets = {
            name: "Spam Tweets",
            data: []
          };
          let xaxis_categories = [];
          response.data.data.spamtweetscountpast7days.forEach(val => {
            spam_tweets.data.push(val.count);
            xaxis_categories.push(val.day);
          });
          series[0] = spam_tweets;
          this.series = series;
          this.options.xaxis.categories = xaxis_categories;
          this.isLoading = false;
        }
      );
    },
    getAllClients() {
      ApiService.get(`/clients/getallclients`).then(response => {
        let allClients = [{ value: null, text: "Select" }];
        let clients = response.data.data.data;
        clients.forEach(val => {
          allClients.push({
            value: val.id,
            text: val.name
          });
        });
        this.allClients = allClients;
      });
    }
  }
};
</script>
