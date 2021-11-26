<template>
  <div class="card">
    <div class="card-body spin" v-if="isLoading">
      <b-spinner
        variant="dark"
        style="width: 10rem; height: 10rem"
        label="Large Spinner"
      ></b-spinner>
    </div>
    <div class="card-body">
      <MapChart
        :countryData="countryData"
        highColor="#ff0000"
        lowColor="#aaaaaa"
        countryStrokeColor="#909090"
        defaultCountryFillColor="#dadada"
      />
    </div>
  </div>
</template>
<script>
import MapChart from "vue-map-chart";
import ApiService from "../../../../../core/services/api.service";
import { mapGetters } from "vuex";

export default {
  name: "ChartMap",
  components: { MapChart },
  data() {
    return {
      isLoading: false,
      countryData: {}
    };
  },
  computed: {
    ...mapGetters(["layoutConfig"]),
    filtersGetter: function() {
      return this.$store.getters.filtersGetter;
    }
  },
  // mounted() {
  //   // this.getData();
  // },
  methods: {
    getData() {
      let dFrom = this.filtersGetter.date_from;
      let dTo = this.filtersGetter.date_to;

      let location = "AE,US,CA, GB,IE,ES,PK,IN,AF,CN,AU,BD,IR,DE,IL,JP,SA";
      this.isLoading = true;
      ApiService.get(
        `/getspamuserlocation?location=${location}&data_from=${dFrom}&data_to=${dTo}`
      ).then(response => {
        this.countryData = response.data.data;
        this.isLoading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .vue-map-legend {
    border-radius: 10px;
  }
}
.spin {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #777777;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  opacity: 0.4;
}
</style>
