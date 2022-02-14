<template>
  <div>
    <HeadFilter />
    <b-modal
      ref="image-modal"
      :centered="true"
      size="md"
      ok-only
      ok-title="Close"
    >
      <b-img :src="selectedImageSrc" fluid @error="setDefaultImage"></b-img>
    </b-modal>
    <b-card v-if="isLoading">
      <b-skeleton-table
        :rows="5"
        :columns="6"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
    </b-card>

    <b-card v-if="!isLoading">
      <!-- <img
        src="/media/images/other_icons/btn_filter_info.svg"
        class="float-right align-middle"
        v-b-toggle.collapse-1
        style="height: 35px"
      /> -->
      <div class="row">
        <div class="col-md-4">
          <!-- <input
            type="text"
            v-model="filter"
            class="form-control  "
            placeholder="Search..."
          /> -->
          <div class="d-flex">
            <b-input-group class="">
              <template #append>
                <b-input-group-text
                  ><strong class="fa fa-search"></strong
                ></b-input-group-text>
              </template>
              <b-form-input placeholder="Enter a Keyword"></b-form-input>
            </b-input-group>
            <button class="ml-3 btn btn-info">Search</button>
          </div>
        </div>
        <div class="col-md-2 offset-md-6">
          <div class="form-group">
            <multiselect
              v-model="per_page"
              @input="getSpamTweets(current_page)"
              :options="[
                { val: 25, label: '25' },
                { val: 50, label: '50' },
                { val: 100, label: '100' },
              ]"
              class="multiselectcustomclass"
              selectLabel="select"
              deselectLabel="can't remove"
              :maxHeight="200"
              label="label"
              track-by="val"
              :allow-empty="false"
            >
            </multiselect>
          </div>
        </div>
      </div>
      <!-- <b-collapse id="collapse-1" class="mt-2">
        <h4 class="card-title">Filter Columns</h4>
        <div class="row">
          <div class="ml-4 d-flex">
            <div
              style="width: 120px"
              v-for="(column, index) in fields"
              :key="index"
            >
              <input
                v-model="column.isColumnEnable"
                type="checkbox"
                class="float-left"
              />
              <label class="ml-3 align-middle font-size-sm">{{
                column.label
              }}</label>
            </div>
          </div>
        </div>
      </b-collapse> -->
      <div class="float-right mb-5">
        <b-icon
          @click="scrollTableLeftHorizontally()"
          class="mr-8"
          icon="arrow-left-circle-fill"
          scale="2"
          variant="info"
          style="cursor: pointer"
        ></b-icon>
        <b-icon
          @click="scrollTableRightHorizontally()"
          icon="arrow-right-circle-fill"
          scale="2"
          variant="info"
          style="cursor: pointer"
        ></b-icon>
      </div>
      <b-table
        id="tableHorizontal"
        class="table table-custom"
        :items="tableData"
        :fields="fields.filter((val) => val.isColumnEnable)"
        show-empty
        :filter="filter"
        :per-page="per_page.val"
        head-variant="light dark"
        borderless
        small
      >
        <template v-slot:cell(text)="row">
          <div class="tweet_text">
            <text-highlight :queries="filter">
              {{ row.item.text }}
            </text-highlight>
          </div>
        </template>
        <template v-slot:cell(media_url)="row">
          <span v-if="row.item.media_url !== null">
            <a
              href="javascript:void(0)"
              @click="toggleModal(row.item.media_url)"
              v-for="(img, i) in 1"
              :key="i"
            >
              <img
                class="img_hw"
                :src="row.item.media_url"
                onerror="this.src='media/images/image_not_found.png'"
              />
            </a>
          </span>
          <p v-else>No Media Url</p>
        </template>
        <template v-slot:cell(name)="row">
          <text-highlight :queries="filter">
            {{ row.item.name }}
          </text-highlight>
        </template>
        <template v-slot:cell(username)="row">
          <text-highlight :queries="filter">
            {{ row.item.username }}
          </text-highlight>
        </template>
        <template v-slot:cell(keyword)="row">
          <text-highlight :queries="filter">
            {{ row.item.keyword }}
          </text-highlight>
        </template>
        <template v-slot:cell(tw_created_at)="row">
          <text-highlight :queries="filter">
            {{ row.item.tw_created_at }}
          </text-highlight>
        </template>
      </b-table>
      <div
        class="d-flex justify-content-between"
        v-if="filter == '' && tableData.length > 0"
      >
        <b-pagination
          v-model="current_page"
          :total-rows="total_records"
          :per-page="per_page.val"
          aria-controls="tableHorizontal"
          @change="getSpamTweets"
        ></b-pagination>
        <div class="font-size-sm">
          {{ `Showing ${from} to ${to} of ${total_records}` }}
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";
import HeadFilter from "../../../layout/subheader/NewHeaderDropdowns.vue";
export default {
  name: "gsa",
  components: { HeadFilter },
  data() {
    return {
      isLoading: false,
      current_page: "1",
      per_page: { val: 25, label: "25" },
      total_records: "",
      from: "",
      to: "",
      filter: "",
      // tableData: [],
      tableData: [
        {
          id: 1,
          resultType: "Result type Organic",
          title: "Organic Title",
          url: "Organic URL",
          dUrl: "Dispaly Organic URL",
          desc: "Organic Desc",
        },
        {
          id: 2,
          resultType: "Result Type Paid",
          title: "Paid Title",
          url: "Paid URL",
          dUrl: "Display Paid URL",
          desc: "Paid Desc",
        },
      ],
      fields: [
        // {
        //   key: "sno",
        //   label: "Serial #",
        //   thStyle: { minWidth: "200px", textAlign: "center" },
        //   isColumnEnable: true,
        //   sortable: true
        // },
        {
          key: "resultType",
          label: "Result-Type (Organic/Paid)",
          thStyle: { minWidth: "200px", textAlign: "center" },
          isColumnEnable: true,
          sortable: true,
        },
        {
          key: "title",
          label: "Title",
          thStyle: { minWidth: "200px", textAlign: "center" },
          isColumnEnable: true,
        },
        {
          key: "url",
          label: "URL",
          thStyle: { minWidth: "150px", textAlign: "center" },
          isColumnEnable: true,
          sortable: true,
        },
        {
          key: "dUrl",
          label: "Display URL",
          thStyle: { minWidth: "150px", textAlign: "center" },
          isColumnEnable: true,
          sortable: true,
        },
        {
          key: "desc",
          label: "Description",
          thStyle: { minWidth: "150px", textAlign: "center" },
          isColumnEnable: true,
          sortable: true,
        },
        // {
        //   key: "id",
        //   label: "Id",
        //   thStyle: { minWidth: "200px", textAlign: "center" },
        //   isColumnEnable: true
        // },
        // {
        //   key: "tweet_count",
        //   label: "Tweet Count",
        //   thStyle: { minWidth: "200px", textAlign: "center" },
        //   isColumnEnable: true
        // },
        // {
        //   key: "retweet_count",
        //   label: "Retweet Count",
        //   thStyle: { minWidth: "200px", textAlign: "center" },
        //   isColumnEnable: true
        // },
        // {
        //   key: "tweet_id",
        //   label: "Tweet Id",
        //   thStyle: { minWidth: "200px", textAlign: "center" },
        //   isColumnEnable: true
        // },
        // {
        //   key: "coupons",
        //   label: "Coupons",
        //   thStyle: { minWidth: "200px", textAlign: "center" }
        // }
      ],
      selectedImageSrc: "",
      client_id_array: [],
      coupon_id_array: [],
      start_date: "",
      end_date: "",
      columnFilters: false,
      selected: [],
    };
  },
  computed: {
    filtersGetter: function() {
      return this.$store.getters.filtersGetter;
    },
  },
  watch: {
    filtersGetter(newValue) {
      if (newValue) {
        this.getSpamTweets(this.current_page);
      }
    },
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Paid Ads Search" }]);
    // this.getSpamTweets(this.current_page);
  },
  methods: {
    toggleModal(imgSrc) {
      this.selectedImageSrc = imgSrc;
      this.$refs["image-modal"].toggle();
    },
    setDefaultImage(event) {
      event.target.src = "media/images/image_not_found.png";
    },
    async getSpamTweets(current_page) {
      this.isLoading = true;
      this.current_page = current_page;
      let dataToPost = this.filtersGetter;
      dataToPost.page = this.current_page;
      dataToPost.per_page = this.per_page.val;
      let response = await ApiService.post(`/tweets/spam`, dataToPost);
      this.tableData = response.data.data.data;
      this.total_records = response.data.data.total;
      this.from = response.data.data.from;
      this.to = response.data.data.to;
      this.isLoading = false;
    },
    scrollTableRightHorizontally() {
      let table = document.getElementById("tableHorizontal");
      table.scrollBy(100, 0);
    },
    scrollTableLeftHorizontally() {
      let table = document.getElementById("tableHorizontal");
      table.scrollBy(-100, 0);
    },
  },
};
</script>

<style scoped>
.img_hw {
  max-height: 75px;
  max-width: 75px;
  margin: 0px 5px 5px 5px;
}

a {
  text-decoration: none;
  display: inline-block;
  padding: 8px 16px;
}

a:hover {
  background-color: #ddd;
  color: black;
}

.previous {
  background-color: #f1f1f1;
  color: black;
}

.next {
  background-color: #4caf50;
  color: white;
}

.round {
  border-radius: 50%;
}
.multiselectcustomclass {
  font-size: 9px !important;
  /* width: 150px; */
}
</style>
