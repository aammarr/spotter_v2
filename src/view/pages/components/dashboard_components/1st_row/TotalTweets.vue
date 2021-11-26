<template>
  <div>
    <b-skeleton-img no-aspect v-if="isLoading" height="160px"></b-skeleton-img>
    <div
      v-if="!isLoading"
      class="card h-100 text-white"
      style="
        background: #36cdc5 0% 0% no-repeat padding-box;
        border: 1px transparent;
        border-radius: 12px;
        min-height: 160px;
      "
    >
      <div class="card-body">
        <img
          style="height: 35px; width: 35px; position: absolute; top: 10%"
          src="media/images/updated_dashboard_icons/icon_tweets.svg"
        />
        <h1
          class="font-weight-bold"
          style="font-size: 40px; position: absolute; top: 40%"
        >
          {{ TotalTweetsCount.toLocaleString() }}
        </h1>
        <div
          class="font-weight-bold font-size-lg"
          style="position: absolute; top: 75%"
        >
          Total Tweets
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "../../../../../core/services/api.service";
export default {
  name: "totaltweets",
  data() {
    return {
      isLoading: false,
      TotalTweetsCount: ""
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
      ApiService.post(`/gettotaltweetscount`, dataToPost).then(response => {
        this.TotalTweetsCount = response.data.TotalTweetsCount;
        this.isLoading = false;
      });
    }
  }
};
</script>
