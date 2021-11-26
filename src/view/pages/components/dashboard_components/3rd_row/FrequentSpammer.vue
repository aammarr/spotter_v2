<template>
  <div class="card card-custom gutter-b" style="min-height: 386px">
    <div class="card-header border-0 pt-5" style="min-height: 50px !important">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"
          >Most Frequent Spammer</span
        >
      </h3>
    </div>
    <div
      class="card-body text-center"
      v-if="pre_data.isLoading"
      style="cursor: wait"
    >
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
    <div class="card-body pt-3 pb-3" v-if="!pre_data.isLoading">
      <div
        class="table-responsive"
        v-if="pre_data.frequentSpammersArray.length > 0"
      >
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
              <th style="min-width: 60%">User Name</th>
              <th style="min-width: 40%">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in pre_data.frequentSpammersArray" :key="i">
              <td class="d-flex" :id="`popoverfrequent-${i}`">
                <div class="symbol symbol-30 symbol-light mr-3">
                  <span class="symbol-label">
                    <img
                      src="media/images/dashboard_icons/robot.svg"
                      class="h-75 align-self-center"
                      alt=""
                    />
                  </span>
                </div>
                <div class="text-dark-20" style="cursor: pointer">
                  <p @click="getTweetUserData(item)" tabindex="0">
                    {{ item.username }}
                  </p>
                </div>
                <b-popover
                  :target="`popoverfrequent-${i}`"
                  triggers="focus"
                  :show.sync="item.show_user_detail"
                  placement="left"
                >
                  <b-skeleton v-if="isUserDataLoading"></b-skeleton>
                  <template v-if="!isUserDataLoading">
                    <div class="d-flex">
                      <span v-if="userData">
                        <img
                          v-if="userData.profile_image_url !== null"
                          :src="userData.profile_image_url"
                          style="
                              height: 40px;
                              width: 45px;
                              border: 1px transparent;
                              border-radius: 12px;
                            "
                        />
                      </span>
                      <span v-else>
                        <img
                          src="media/images/dashboard_icons/robot.svg"
                          style="
                              height: 40px;
                              width: 45px;
                              border: 1px transparent;
                              border-radius: 12px;
                            "
                        />
                      </span>
                      <p class="ml-4 font-weight-bold">
                        {{ userData ? userData.username : "No Username" }}
                        <br />
                        <small class="text-muted float-left">{{
                          userData ? `@${userData.name}` : "--"
                        }}</small>
                      </p>
                    </div>
                    <!-- <p class="font-size-sm mt-5">
                        {{ userData ? userData.description : "--" }}
                      </p> -->
                    <div class="d-flex">
                      <p class="font-size-sm text-muted">Followers</p>
                      <b class="font-size-sm ml-3" style="font-weight: 700">
                        {{
                          userData
                            ? userData.public_metrics.followers_count
                            : "--"
                        }}
                      </b>
                    </div>
                    <div class="d-flex">
                      <p class="font-size-sm text-muted">Following</p>
                      <b class="font-size-sm ml-3" style="font-weight: 700">
                        {{
                          userData
                            ? userData.public_metrics.following_count
                            : "--"
                        }}
                      </b>
                    </div>
                    <div class="d-flex">
                      <p class="font-size-sm text-muted">Status</p>
                      <b class="font-size-sm ml-3" style="font-weight: 700">
                        Active
                      </b>
                    </div>
                    <b-button
                      @click="viewProfile(userData.username)"
                      type="button"
                      variant="outline-info"
                      block
                      class="mt-3 btn-sm bg-light-success"
                      >View Profile</b-button
                    >
                  </template>
                </b-popover>
              </td>
              <td class="text-left pr-0">
                <span
                  class="text-dark-50 font-weight-bolder d-block font-size-sm"
                  >{{ item.count }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="alert alert-info text-center" v-else>No Records</div>
    </div>
  </div>
</template>

<script>
import ApiService from "../../../../../core/services/api.service";

export default {
  name: "frequentspammer",
  props: ["pre_data"],
  data() {
    return {
      isUserDataLoading: false,
      userData: null
    };
  },

  methods: {
    viewProfile(user_name) {
      window.open(`https://www.twitter.com/` + user_name, "_blank");
    },
    getTweetUserData(obj) {
      this.userData = null;
      if (obj.username == null || obj.username == "") {
        return;
      }
      this.isUserDataLoading = true;
      let frequentSpammers = this.pre_data.frequentSpammersArray;
      frequentSpammers.forEach(val => {
        if (val.sr_no == obj.sr_no) {
          val.show_user_detail = true;
        } else {
          val.show_user_detail = false;
        }
      });
      ApiService.get(`/twitterdataforusername?username=${obj.username}`).then(
        response => {
          if (response.data.status == "Success") {
            this.userData = response.data.data;
            this.isUserDataLoading = false;
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.on_hover_font_size {
  transition-duration: 0.1s;
}
.on_hover_font_size:hover {
  font-size: 1.2rem;
}
</style>
