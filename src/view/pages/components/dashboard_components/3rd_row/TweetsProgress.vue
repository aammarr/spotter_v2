<template>
  <div
    class="card card-custom gutter-b"
    style="min-height: 386px; background: #6993ff"
  >
    <div class="card-header border-0" style="min-height: 50px !important">
      <h3 class="card-title text-white font-weight-bolder">Tweets Progress</h3>
    </div>
    <div class="card-body text-center" v-if="pre_data.isLoading">
      <b-spinner
        style="
          width: 5rem;
          height: 5rem;
          position: absolute;
          top: 32%;
          left: 42%;
        "
        variant="light"
      ></b-spinner>
    </div>
    <div class="card-body d-flex flex-column p-0" v-if="!pre_data.isLoading">
      <apexchart
        type="bar"
        :options="pre_data.options"
        :series="pre_data.series"
        height="130px"
      ></apexchart>
      <div
        class="card-spacer bg-white"
        style="
          min-height: 206px;
          border-top: 1px transparent;
          border-top-left-radius: 12%;
          border-top-right-radius: 12%;
        "
      >
        <div class="row m-0">
          <div class="col mr-8">
            <div class="font-size-h5 mt-5 text-muted font-weight-bold">
              Overall Tweets
            </div>
            <small class="text-muted">past 7 days</small>
            <div class="font-size-h1 text-dark" style="font-weight: 800">
              {{ pre_data.totalTweetCount }}
            </div>
          </div>
          <div class="col">
            <div class="font-size-h5 mt-5 text-muted font-weight-bold">
              Average Spam Tweets
            </div>
            <small class="text-muted">per day</small>
            <div class="font-size-h1 text-dark" style="font-weight: 800">
              {{ (parseInt(pre_data.spamTweetCount) / 7).toFixed(1) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tweetsprogress",
  props: ["pre_data"]
};
</script>
