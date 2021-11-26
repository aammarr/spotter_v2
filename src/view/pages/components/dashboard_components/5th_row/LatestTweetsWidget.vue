<template>
  <div>
    <!-- style="max-height: 550px; overflow-y: scroll" -->
    <h3 class="card-title align-items-start flex-column ml-2 mb-1">
      <span class="card-label font-weight-bolder text-dark">Last Tweets</span>
    </h3>
    <p class="ml-2 text-muted">updated 15 minutes ago</p>
    <div class="card-body text-center" v-if="isLoading">
      <b-spinner
        style="
          width: 5rem;
          height: 5rem;
          position: absolute;
          top: 32%;
          left: 48%;
        "
        variant="dark"
      ></b-spinner>
    </div>
    <b-card-group v-if="!isLoading" columns>
      <div
        v-for="(tweet, i) in latestTweets"
        :key="i"
        class="card onhovershadow"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div class="d-flex">
              <div>
                <div
                  class="d-flex align-items-center"
                  v-if="tweet.media_url !== null"
                >
                  <div class="symbol symbol-30 symbol-light mr-2">
                    <span class="symbol-label">
                      <img
                        class="h-75 align-self-center"
                        :src="tweet.media_url"
                      />
                    </span>
                  </div>
                </div>
                <div class="d-flex align-items-center" v-else>
                  <div class="symbol symbol-40 symbol-light mr-2">
                    <span class="symbol-label">
                      <img
                        class="h-100 w-100 align-self-center rounded-circle"
                        src="media/images/image_not_found.png"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div :id="`container-${i}`">
                <h5
                  class="card-title text-success mb-5"
                  style="cursor: pointer"
                  :id="`popoverlatest-${i}`"
                  @click="getTweetUserData(tweet)"
                  tabindex="0"
                >
                  <span class="ml-3">{{
                    tweet.username ? `@${tweet.username}` : "No Username"
                  }}</span>
                </h5>
                <b-popover
                  :target="`popoverlatest-${i}`"
                  triggers="focus"
                  :show.sync="tweet.show_user_detail"
                  placement="rightbottom"
                  :container="`container-${i}`"
                >
                  <b-skeleton v-if="isUserDataLoading"></b-skeleton>
                  <template v-if="!isUserDataLoading">
                    <div class="d-flex">
                      <span v-if="userData">
                        <img
                          v-if="userData.profile_image_url !== null"
                          :src="userData.profile_image_url"
                          style="
                            height: 60px;
                            width: 65px;
                            border: 1px transparent;
                            border-radius: 12px;
                          "
                        />
                      </span>
                      <span v-else>
                        <img
                          src="media/images/dashboard_icons/robot.svg"
                          style="
                            height: 60px;
                            width: 65px;
                            border: 1px transparent;
                            border-radius: 12px;
                          "
                        />
                      </span>
                      <h4 class="ml-4 font-size-xl font-weight-bold">
                        {{ userData ? userData.username : "No Username" }}
                        <br />
                        <small class="text-muted float-left">{{
                          userData ? `@${userData.name}` : "--"
                        }}</small>
                      </h4>
                    </div>
                    <p class="font-size-sm mt-5">
                      {{ userData ? userData.description : "--" }}
                    </p>
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
                      class="mt-3 bg-light-success"
                      >View Profile</b-button
                    >
                  </template>
                </b-popover>
                <h6 class="card-subtitle ml-3 font-size-sm text-dark">
                  {{ tweet.tw_created_at ? tweet.tw_created_at : "00-00-0000" }}
                </h6>
              </div>
            </div>
            <div :class="`container-whitelisted-${i}`" style="cursor: pointer">
              <b-icon
                icon="three-dots"
                font-scale="2"
                :id="`popoverwhitelisted-${i}`"
                tabindex="0"
              ></b-icon>
              <b-popover
                :target="`popoverwhitelisted-${i}`"
                variant="light"
                custom-class="popoverCustomize"
                triggers="focus"
                placement="leftbottom"
                :container="`container-whitelisted-${i}`"
              >
                <template>
                  <div class="text-center">
                    <b-icon
                      v-if="isSpinnerLoading"
                      icon="arrow-counterclockwise"
                      animation="spin-reverse-pulse"
                      font-scale="2"
                    ></b-icon>

                    <div
                      v-if="!isSpinnerLoading"
                      class="font-weight-bold onhovercolor"
                      style="cursor: pointer"
                      @click="whitelistUser(tweet.username)"
                    >
                      Whitelist this User
                    </div>
                  </div>
                </template>
              </b-popover>
            </div>
          </div>
          <p
            class="card-text mt-6"
            v-for="(nextLineItem, index) in tweet.text.split('\n')"
            :key="index"
          >
            {{ nextLineItem }}
          </p>
          <div class="d-flex justify-content-end">
            <!-- reply -->
            <!-- <a href="#" class="card-link text-info">
              <img
                style="height: 20px; width: 20px"
                src="media/images/latest_tweet_icons/icon_share_filled.svg"
              />
            </a> -->
            <!-- retweets -->
            <a
              href="#"
              class="card-link text-info"
              v-b-tooltip.hover
              title="Retweets"
            >
              <img
                style="height: 20px; width: 20px"
                src="media/images/latest_tweet_icons/icon_retweet_filled.svg"
              />
              {{ tweet.retweet_count }}
            </a>
            <!-- favorites -->
            <!-- <a href="#" class="card-link text-info">
              <img
                style="height: 20px; width: 20px"
                src="media/images/latest_tweet_icons/icon_like_filled.svg"
              />
              {{ tweet.retweet_count }}
            </a> -->
          </div>
        </div>
      </div>
    </b-card-group>
  </div>
</template>

<script>
import ApiService from "../../../../../core/services/api.service";
export default {
  name: "latesttweetswidget",
  data() {
    return {
      isLoading: false,
      latestTweets: [],
      isUserDataLoading: false,
      userData: null,
      isSpinnerLoading: false
    };
  },
  mounted() {
    this.getAllTweets();
  },
  methods: {
    getAllTweets() {
      this.isLoading = true;
      ApiService.post(`/tweets/all?per_page=15`).then(response => {
        let latestTweets = [];
        let data = response.data.data.data;
        data.forEach(element => {
          latestTweets.push({
            followers_count: element.followers_count,
            keyword: element.keyword,
            media_url: element.media_url,
            name: element.name,
            retweet_count: element.retweet_count,
            text: element.text,
            tw_created_at: element.tw_created_at,
            tweet_count: element.tweet_count,
            tweet_id: element.tweet_id,
            user_id: element.user_id,
            username: element.username,
            show_user_detail: false
          });
        });
        this.latestTweets = latestTweets;
        this.isLoading = false;
      });
    },
    getTweetUserData(obj) {
      this.userData = null;
      if (obj.username == null || obj.username == "") {
        return;
      }
      this.isUserDataLoading = true;
      this.latestTweets.forEach(val => {
        if (val.tweet_id == obj.tweet_id) {
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
    },
    whitelistUser(user_name) {
      this.isSpinnerLoading = true;
      let usernames = [];
      usernames.push(user_name);
      let dataToPost = {
        usernames: usernames
      };
      ApiService.post(`/users/addvalid`, dataToPost).then(res => {
        if (res.data.success == true) {
          this.isSpinnerLoading = false;
          this.showMsg("info", user_name);
        }
      });
    },
    showMsg(type, user_name) {
      this.$swal
        .fire({
          icon: type,
          html: `<div>${user_name} is added to whitelisted users successfully</div>`
        })
        .then(result => {
          if (result.isConfirmed) {
            if (type == "success") {
              // this.resetForm();
            }
          }
        });
    },
    viewProfile(user_name) {
      window.open(`https://www.twitter.com/` + user_name, "_blank");
    }
  }
};
</script>
