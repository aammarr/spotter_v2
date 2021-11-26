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
            <h4 style="font-weight: bolder">Spam vs All</h4>
          </span>
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
        class="card-rounded-bottom"
        :options="options"
        :series="SpamVsAllData"
        type="line"
        height="300px"
      ></apexchart>
    </div>
  </div>
</template>
<script>
import ApiService from "../../../../../core/services/api.service";

export default {
  name: "spamvsall",
  data() {
    return {
      options: {},
      SpamVsAllData: [],
      isLoading: false
    };
  },
  computed: {
    filtersGetter: function() {
      return this.$store.getters.filtersGetter;
    }
  },
  watch: {
    filtersGetter(newValue) {
      if (newValue) {
        if (newValue.clients.length > 0 || newValue.coupons.length > 0) {
          this.getData();
        }
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.isLoading = true;
      let dataToPost = this.filtersGetter;
      ApiService.post(`/tweets/spamvsall`, dataToPost).then(response => {
        let series = [];
        let months = {
          1: "Jan",
          2: "Feb",
          3: "Mar",
          4: "Apr",
          5: "May",
          6: "Jun",
          7: "Jul",
          8: "Aug",
          9: "Sep",
          10: "Oct",
          11: "Nov",
          12: "Dec"
        };
        let all_tweets = {
          name: "All Tweets",
          type: "column",
          data: [],
          months: []
        };
        let spam_tweets = {
          name: "Spam Tweets",
          type: "line",
          data: [],
          months: []
        };
        response.data.data.allTweets.forEach(element => {
          all_tweets.data.push(element.count);
          all_tweets.months.push(months[element.month]);
        });
        response.data.data.spamTweets.forEach(element => {
          spam_tweets.data.push(element.count);
          spam_tweets.months.push(months[element.month]);
        });
        series[0] = all_tweets;
        series[1] = spam_tweets;
        this.SpamVsAllData = series;
        this.setData();
      });
    },
    setData() {
      if (this.SpamVsAllData.length > 0) {
        let xaxis = {
          categories: []
        };
        this.SpamVsAllData[0].months.forEach(element => {
          xaxis.categories.push(element);
        });
        var options = {
          colors: ["#6993FF", "#000000"],
          grid: {
            show: true,
            strokeDashArray: 5
          },

          chart: {
            type: "line",
            toolbar: {
              show: false
            }
          },
          stroke: {
            width: [1, 4],
            curve: "smooth"
          },
          xaxis: xaxis,
          legend: {
            show: false
          }
        };
        this.options = options;
        this.isLoading = false;
      }
    }
  }
};
</script>
