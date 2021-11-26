<template>
  <div>
    <b-skeleton-img no-aspect v-if="isLoading" height="160px"></b-skeleton-img>
    <div
      v-if="!isLoading"
      class="card bg-info h-100"
      style="border: 1px transparent; border-radius: 12px; min-height: 160px"
    >
      <div class="w-50">
        <apexchart
          type="radialBar"
          :options="options"
          :series="[parseInt(PercentageOfSpam)]"
          height="155px"
        ></apexchart>
      </div>
      <div
        class="font-weight-bold font-size-lg text-white"
        style="position: absolute; top: 75%; left: 10%"
      >
        Spam Tweets
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "../../../../../core/services/api.service";
export default {
  name: "spamtweetspercentage",
  data() {
    return {
      isLoading: false,
      options: {},
      PercentageOfSpam: ""
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
        this.getData();
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
      ApiService.post(`/tweets/spampercentage`, dataToPost).then(response => {
        var options = {
          colors: ["#fff"],
          chart: {
            type: "radialBar"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "65%"
              },
              dataLabels: {
                name: {
                  show: false,
                  offsetY: 72,
                  fontSize: "14px",
                  fontWeight: "300"
                },
                value: {
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  offsetY: 10,
                  show: true
                }
              }
            }
          },

          stroke: {
            lineCap: "round"
          }
        };
        this.options = options;
        this.PercentageOfSpam = response.data.data;
        this.isLoading = false;
      });
    }
  }
};
</script>
