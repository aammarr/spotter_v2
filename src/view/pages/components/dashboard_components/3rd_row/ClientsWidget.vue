<template>
  <div
    class="card card-custom gutter-b"
    style="min-height: 386px; max-height: 386px; overflow-y: scroll"
  >
    <div class="card-header border-0 pt-5" style="min-height: 50px !important">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">
          Spam Tweets Count By Brands
        </span>
      </h3>
    </div>
    <div class="card-body text-center" v-if="isLoading" style="cursor: wait">
      <b-spinner
        style="
          width: 5rem;
          height: 5rem;
          position: absolute;
          top: 42%;
          left: 42%;
        "
      ></b-spinner>
    </div>
    <div class="card-body pt-3 pb-3" v-if="!isLoading">
      <div class="table-responsive" v-if="clientsArray.length > 0">
        <table
          class="
            table
            table-head-custom
            table-vertical-center
            table-head-bg
            table-borderless
          "
        >
          <thead>
            <tr>
              <th style="min-width: 60%">Brand</th>
              <th style="min-width: 40%">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(client, i) in clientsArray" v-bind:key="i">
              <td class="d-flex">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-30 symbol-light mr-3">
                    <span class="symbol-label">
                      <img
                        :src="client.image"
                        class="h-75 align-self-end"
                        style="height: inherit !important; width: inherit"
                        alt=""
                      />
                    </span>
                  </div>
                </div>
                <span
                  class="text-dark-50 font-weight-bolder d-block font-size-sm"
                  >{{ client.brand }}</span
                >
              </td>
              <td>
                <span
                  class="text-dark-50 font-weight-bolder d-block font-size-sm"
                  >{{ client.spamtweetcount }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="alert alert-primary text-center" v-else>No Records</div>
    </div>
  </div>
</template>

<script>
import ApiService from "../../../../../core/services/api.service";
export default {
  name: "clientswidget",
  data() {
    return {
      clientsArray: [],
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
      ApiService.post(`/tweets/spamtweetcount`, dataToPost).then(response => {
        this.clientsArray = response.data.data;
        this.isLoading = false;
      });
    }
  }
};
</script>
