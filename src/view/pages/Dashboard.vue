/* eslint-disable no-undef */
<template>
  <div>
    <!-- 1st Row -->
    <div class="row gutter-b">
      <div class="col-xxl-3 col-md-3">
        <spamtweetspercentage ref="spamtweetspercentage"></spamtweetspercentage>
      </div>
      <div class="col-xxl-3 col-md-3">
        <totalfrequentspammers
          :pre_data="{
            isLoading: isFrequentSpammerDataLoading,
            totalFrequentSpammersCount: totalFrequentSpammersCount
          }"
        ></totalfrequentspammers>
      </div>

      <div class="col-xxl-3 col-md-3">
        <spamtweetsperminute ref="spamtweetsperminute"></spamtweetsperminute>
      </div>

      <div class="col-xxl-3 col-md-3">
        <totaltweets ref="totaltweets"></totaltweets>
      </div>
    </div>
    <!-- 2nd Row -->
    <div class="row">
      <div class="col-xxl-6 col-md-6">
        <spamtweetstrends
          :pre_data="{
            isLoading: isTotalTweetCountPast7DaysLoading,
            series: spamTweetsTrendsDataSeries,
            options: spamTweetsTrendsDataOptions
          }"
        ></spamtweetstrends>
      </div>

      <div class="col-xxl-6 col-md-6">
        <spamvsall ref="spamvsall"></spamvsall>
      </div>
    </div>

    <!-- 3rd row -->
    <div class="row">
      <div class="col-xxl-4 col-md-4">
        <frequentspammer
          :pre_data="{
            isLoading: isFrequentSpammerDataLoading,
            frequentSpammersArray: frequentSpammersArray
          }"
        ></frequentspammer>
      </div>
      <div class="col-xxl-4 col-md-4">
        <tweetsprogress
          :pre_data="{
            isLoading: isTotalTweetCountPast7DaysLoading,
            series: tweetProgressDataSeries,
            options: tweetProgressDataOptions,
            spamTweetCount: tweetProgressSpamTweetCount,
            totalTweetCount: tweetProgressTotalTweetsCount
          }"
        ></tweetsprogress>
      </div>
      <div class="col-xxl-4 col-md-4">
        <clientswidget ref="clientswidget"></clientswidget>
      </div>
    </div>
    <!-- 4th row -->
    <div class="row mb-2">
      <div class="col-xxl-12">
        <div class="row">
          <div class="col-xxl-12">
            <ChartMap ref="chartmap"></ChartMap>
          </div>
        </div>
      </div>
    </div>
    <!-- 5th row -->
    <div class="row">
      <div class="col-xxl-12">
        <latesttweetswidget></latesttweetswidget>
      </div>
    </div>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { mapGetters, mapActions } from "vuex";

// first row components
import spamtweetspercentage from "@/view/pages/components/dashboard_components/1st_row/SpamTweetsPercentage.vue";
import totalfrequentspammers from "@/view/pages/components/dashboard_components/1st_row/TotalFrequentSpammers.vue";
import spamtweetsperminute from "@/view/pages/components/dashboard_components/1st_row/SpamTweetsPerMinute.vue";
import totaltweets from "@/view/pages/components/dashboard_components/1st_row/TotalTweets.vue";
// second row components
import spamtweetstrends from "@/view/pages/components/dashboard_components/2nd_row/SpamTweetsTrends";
import spamvsall from "@/view/pages/components/dashboard_components/2nd_row/SpamVsAll.vue";
// third row components
import frequentspammer from "@/view/pages/components/dashboard_components/3rd_row/FrequentSpammer.vue";
import tweetsprogress from "@/view/pages/components/dashboard_components/3rd_row/TweetsProgress.vue";
import clientswidget from "@/view/pages/components/dashboard_components/3rd_row/ClientsWidget.vue";
// fourth row components
import ChartMap from "@/view/pages/components/dashboard_components/4th_row/ChartMap.vue";
// fifth row components
import latesttweetswidget from "@/view/pages/components/dashboard_components/5th_row/LatestTweetsWidget.vue";
import ApiService from "../../core/services/api.service";
import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
import { gmapApi } from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAVJiRDZsecoVecl0fiq2xHchQdWihXr3k"
    // libraries: 'places', // This is required if you use the Autocomplete plugin
  },
  installComponents: true
});
export default {
  name: "dashboard",
  components: {
    spamtweetspercentage,
    spamtweetsperminute,
    totaltweets,
    totalfrequentspammers,
    spamtweetstrends,
    spamvsall,
    frequentspammer,
    tweetsprogress,
    clientswidget,
    ChartMap,
    latesttweetswidget
  },
  data() {
    return {
      MapCenter: { lat: 51.1657, lng: 10.4515 },
      MapZoom: 2,
      gmap: "gmap",
      MapIndex: [
        { lat: 46.2276, lng: 2.2137 },
        { lat: 39.5056619, lng: -3.6133876 },
        { lat: 41.8719, lng: 12.5674 },
        { lat: 51.1657, lng: 10.4515 },
        { lat: 54.7987085321166, lng: -2.626670083364104 }
      ],
      info_marker: null,
      infowindow: null,
      window_open: false,
      client_id_array: [],
      coupon_id_array: [],
      start_date: "",
      end_date: "",
      isFrequentSpammerDataLoading: false,
      frequentSpammersArray: [],
      totalFrequentSpammersCount: 0,
      isTotalTweetCountPast7DaysLoading: false,
      spamTweetsTrendsDataSeries: [],
      spamTweetsTrendsDataOptions: {
        colors: ["#6993FF"],
        grid: {
          show: true,
          strokeDashArray: 5
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [],
          axisBorder: {
            show: false
          }
        },
        legend: {
          show: false
        },

        stroke: {
          curve: "smooth"
        },
        chart: {
          toolbar: {
            show: false
          }
        }
      },
      tweetProgressDataSeries: [],
      tweetProgressDataOptions: {},
      tweetProgressSpamTweetCount: 0,
      tweetProgressTotalTweetsCount: 0,
      spamTweetCountData: [],
      isSpamDataLoading: false
    };
  },
  computed: {
    ...mapActions(["setIsSyncAction"]),
    ...mapGetters(["layoutConfig"]),
    filtersGetter: function() {
      return this.$store.getters.filtersGetter;
    },
    isSyncGetter() {
      return this.$store.getters.isSyncGetter;
    },
    google: gmapApi
  },
  created() {
    this.getFrequentSpammers();
    this.getTotalTweetCountPast7Days();
  },
  watch: {
    filtersGetter(newValue) {
      if (newValue) {
        this.getFrequentSpammers();
        if (newValue.clients.length > 0 || newValue.coupons.length > 0) {
          this.getTotalTweetCountPast7Days();
        }
      }
    },
    isSyncGetter(newValue) {
      if (newValue) {
        this.syncData();
      }
      this.$store.dispatch("setIsSyncAction", false);
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Dashboard" }]);
    this.setMapCenter();
  },
  methods: {
    openWindow(pos) {
      this.infowindow = pos;
      this.window_open = true;
    },
    setMapCenter() {
      let positionArray = this.MapIndex;

      this.$refs.gmap.$mapPromise.then(map => {
        const bounds = new this.google.maps.LatLngBounds();
        for (let m of positionArray) {
          bounds.extend(m.position);
        }
        map.fitBounds(bounds);
      });
    },
    syncData() {
      this.cacheRefresh().then(() => {
        this.showMsg(
          "success",
          "The latest data is being synchronized. This may take a few seconds",
          true
        );
      });
    },
    showMsg(type, msg, callApi) {
      this.$swal
        .fire({
          icon: type,
          text: msg
        })
        .then(result => {
          if (result.isConfirmed) {
            if (callApi) {
              this.callEachApiOnDashboard();
            }
          }
        });
    },
    callEachApiOnDashboard() {
      this.getFrequentSpammers();
      this.getTotalTweetCountPast7Days();
      this.$refs.spamtweetsperminute.getData();
      this.$refs.totaltweets.getData();
      this.$refs.spamvsall.getData();
      this.$refs.spamtweetspercentage.getData();
      this.$refs.clientswidget.getData();
      this.$refs.chartmap.getData();
      let that = this;
      setTimeout(() => {
        that.showMsg("success", "Data has been synced successfully", false);
      }, 12000);
    },
    getFrequentSpammers() {
      this.isFrequentSpammerDataLoading = true;
      let dataToPost = this.filtersGetter;
      ApiService.post(`/tweets/frequentspammers`, dataToPost).then(response => {
        let frequentSpammersArray = [];
        let data = response.data.data.data;
        if (data.length > 0) {
          for (let i = 0; i < 5; i++) {
            frequentSpammersArray.push({
              sr_no: i,
              username: data[i].username,
              count: data[i].count,
              show_user_detail: false
            });
          }
        }

        this.totalFrequentSpammersCount = response.data.data.total;
        this.frequentSpammersArray = frequentSpammersArray;
        this.$refs.chartmap.getData();

        this.isFrequentSpammerDataLoading = false;
      });
    },
    setDataForSpamTweetTrends(result) {
      let spamTweetsTrendsDataSeries = [];
      let spam_tweets = {
        name: "Spam Tweets",
        data: []
      };
      let xaxis_categories = [];
      result.spamtweetscountpast7days.forEach(val => {
        spam_tweets.data.push(val.count);
        xaxis_categories.push(val.day);
      });
      spamTweetsTrendsDataSeries[0] = spam_tweets;
      this.spamTweetsTrendsDataSeries = spamTweetsTrendsDataSeries;
      this.spamTweetsTrendsDataOptions.xaxis.categories = xaxis_categories;
    },
    setDataForTweetProgress(result) {
      let all_tweets = {
        name: "All Tweets",
        data: []
      };
      let spam_tweets = {
        name: "Spam Tweets",
        data: []
      };
      let xaxis_categories = [];
      let spamTweetCount = result.totalspamtweetcount7days;
      let totalTweetsCount = result.totalalltweetcount7days;

      result.alltweetscountpast7days.forEach(val => {
        all_tweets.data.push(val.count);
        xaxis_categories.push(val.day);
      });
      result.spamtweetscountpast7days.forEach(val => {
        spam_tweets.data.push(val.count);
      });

      this.tweetProgressDataSeries[0] = all_tweets;
      this.tweetProgressDataSeries[1] = spam_tweets;
      this.tweetProgressSpamTweetCount = spamTweetCount;
      this.tweetProgressTotalTweetsCount = totalTweetsCount;
      this.xaxis_categories = xaxis_categories;
      this.tweetProgressDataOptions = {
        chart: {
          type: "bar",
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: ["30%"],
            endingShape: "rounded"
          }
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["transparent"]
        },
        xaxis: {
          categories: [],
          axisBorder: {
            show: false
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false
          }
        },
        fill: {
          opacity: 1
        },
        states: {
          normal: {
            filter: {
              type: "none",
              value: 0
            }
          }
        },
        tooltip: {
          style: {
            fontSize: "12px",
            fontFamily: this.layoutConfig("font-family")
          },
          y: {
            formatter: function(val) {
              return val;
            }
          }
        },
        colors: ["#1CB7B2", "#fff"],
        grid: {
          borderColor: this.layoutConfig("colors.gray.gray-200"),
          strokeDashArray: 4,
          yaxis: {
            lines: {
              show: false
            }
          }
        }
      };
      this.tweetProgressDataOptions.xaxis.categories = xaxis_categories;
    },
    getTotalTweetCountPast7Days() {
      this.isTotalTweetCountPast7DaysLoading = true;
      let dataToPost = {
        clients: this.filtersGetter.clients,
        period: "7days"
      };
      ApiService.post(`/totaltweetcountpast7days`, dataToPost).then(
        response => {
          let result = response.data.data;
          this.setDataForSpamTweetTrends(result);
          this.setDataForTweetProgress(result);
          this.isTotalTweetCountPast7DaysLoading = false;
        }
      );
    },
    setActiveTab1(event) {
      this.tabIndex = this.setActiveTab(event);
    },
    setActiveTab2(event) {
      this.tabIndex2 = this.setActiveTab(event);
    },
    /**
     * Set current active on click
     * @param event
     */
    setActiveTab(event) {
      // get all tab links
      const tab = event.target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set current active tab
      event.target.classList.add("active");

      // set clicked tab index to bootstrap tab
      return parseInt(event.target.getAttribute("data-tab"));
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .vue-map {
  border-radius: 5px;
}
</style>
