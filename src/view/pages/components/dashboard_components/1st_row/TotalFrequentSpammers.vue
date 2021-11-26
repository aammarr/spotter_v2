<template>
  <div>
    <b-skeleton-img
      no-aspect
      v-if="pre_data.isLoading"
      height="160px"
    ></b-skeleton-img>
    <div
      v-if="!pre_data.isLoading"
      class="card bg-danger h-100 text-white"
      style="border: 1px transparent; border-radius: 12px; min-height: 160px"
    >
      <div class="card-body">
        <img
          style="height: 35px; width: 35px; position: absolute; top: 10%"
          src="media/images/updated_dashboard_icons/icon_frequent.svg"
        />
        <h1
          class="font-weight-bold"
          style="font-size: 40px; position: absolute; top: 40%"
        >
          {{ pre_data.totalFrequentSpammersCount.toLocaleString() }}
        </h1>
        <div
          class="font-weight-bold font-size-lg"
          style="position: absolute; top: 75%"
        >
          Frequent Spammers
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "totalfrequentspammers",
  props: ["pre_data"],
  data() {
    return {
      isLoading: false,
      totalFrequentSpammers: ""
    };
  }
};
</script>
