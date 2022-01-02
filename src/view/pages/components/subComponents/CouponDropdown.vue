<template>
  <multiselect
    v-model="selected_coupon"
    :options="allCoupons"
    class="multiselectcustomclass"
    selectLabel="select"
    deselectLabel="remove"
    :preserve-search="true"
    :maxHeight="200"
    :placeholder="pHolder"
    :multiple="true"
    :style="'width:' + w + '%'"
    :internal-search="false"
    @input="changed"
    @search-change="getData"
  >
  </multiselect>
</template>
<script>
import ApiService from "../../../../core/services/api.service";
export default {
  name: "coupon-dropdown",
  props: ["placeHolder", "width"],
  data() {
    return {
      pHolder: this.placeHolder ? this.placeHolder : "Coupons",
      w: this.width ? this.width : 20,
      selected_coupon: "",
      allCoupons: []
    };
  },
  methods: {
    getData(val) {
      let dataToPost = {
        search_string: val.toUpperCase()
      };
      if (val != "") {
        ApiService.post(`/coupons/searchwithincoupon`, dataToPost).then(
          response => {
            this.allCoupons = response.data.data ? response.data.data : [];
          }
        );
      }
    },
    changed() {
      this.$emit("changed", this.selected_coupon);
    }
  }
};
</script>
