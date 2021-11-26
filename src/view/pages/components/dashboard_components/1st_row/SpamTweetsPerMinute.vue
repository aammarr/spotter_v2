<template>
  <div>
    <b-skeleton-img no-aspect v-if="isLoading" height="160px"></b-skeleton-img>
    <div
      v-if="!isLoading"
      class="card bg-dark h-100 text-white"
      style="border: 1px transparent; border-radius: 12px; min-height: 160px"
    >
      <div class="card-body">
        <img
          style="height: 35px; width: 35px; position: absolute; top: 10%"
          src="media/images/updated_dashboard_icons/icon_lastupdate.svg"
        />
        <h1
          class="font-weight-bold"
          style="font-size: 40px; position: absolute; top: 40%"
        >
          {{ SpamTweetPerMinuteCount }}
        </h1>
        <div
          class="font-weight-bold font-size-lg"
          style="position: absolute; top: 75%"
        >
          Spam Tweets Per Minute
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "../../../../../core/services/api.service";
export default {
  name: "spamtweetsperminute",
  data() {
    return {
      isLoading: false,
      SpamTweetPerMinuteCount: ""
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
      ApiService.post(`/tweets/spamtweetperminute`, dataToPost).then(
        response => {
          this.SpamTweetPerMinuteCount = response.data.SpamTweetPerMinuteCount;
          this.isLoading = false;
        }
      );
    }
  }
};
</script>
