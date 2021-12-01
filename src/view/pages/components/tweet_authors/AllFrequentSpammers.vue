<template>
  <div>
    <div class="row">
      <div class="col-md-12 d-flex justify-content-end">
        <div class="w-50">
          <multiselect
            id="isSearch"
            v-model="isSearch"
            class="mb-2"
            tag-placeholder="Add this as new tag"
            placeholder="Search..."
            :options="isSearch"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
          ></multiselect>
        </div>
        <b-button
          class="ml-4"
          variant="info"
          style="height:80%"
          :disabled="!isSearch.length > 0"
          @click="getAllFrequentSpammers(1)"
        >
          Search
        </b-button>
      </div>
    </div>
    <b-card v-if="isLoading" class="mt-3">
      <b-skeleton-table
        :rows="5"
        :columns="6"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
    </b-card>
    <b-card v-if="!isLoading" class="mt-3" style="min-height: 350px">
      <b-table
        :items="tableData"
        :fields="fields"
        id="tableHorizontal"
        head-variant="light dark"
        show-empty
        borderless
      >
        <template v-slot:cell(username)="row">
          <b>{{ row.item.username }}</b>
        </template>
        <template v-slot:cell(count)="row">
          <b>{{ row.item.count }}</b>
        </template>
        <template v-slot:cell(media)>
          <img
            src="media/images/dashboard_icons/robot.svg"
            style="
              height: 40px;
              width: 45px;
              border: 1px transparent;
              border-radius: 12px;
            "
          />
        </template>
      </b-table>

      <div class="d-flex justify-content-between" v-if="tableData.length > 0">
        <b-pagination
          v-model="current_page"
          :total-rows="total_records"
          :per-page="per_page.val"
          aria-controls="tableHorizontal"
          @change="getAllFrequentSpammers"
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
export default {
  name: "allfrequentspammers",
  data() {
    return {
      isLoading: false,
      isSearch: [],
      current_page: "1",
      per_page: { val: 25, label: "25" },
      total_records: "",
      from: "",
      to: "",
      filter: "",
      fields: [
        {
          key: "username",
          label: "USERNAME",
          thStyle: { maxWidth: "100px" }
        },
        {
          key: "count",
          label: "COUNT",
          thStyle: { maxWidth: "100px" }
        },
        {
          key: "media",
          label: "MEDIA",
          thStyle: { maxWidth: "100px" }
        }
      ],
      tableData: []
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
        this.getAllFrequentSpammers(this.current_page);
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Frequent Spammers" }]);
    this.getAllFrequentSpammers(this.current_page);
  },
  methods: {
    addTag(newTag) {
      this.isSearch.push(newTag);
    },
    getAllFrequentSpammers(current_page) {
      this.isLoading = true;
      this.current_page = current_page;
      let dataToPost = this.filtersGetter;
      dataToPost.page = this.current_page;
      dataToPost.per_page = this.per_page.val;
      dataToPost.user_full_names = this.isSearch;

      ApiService.post("/tweets/frequentspammers", dataToPost).then(response => {
        this.tableData = response.data.data.data;
        this.total_records = response.data.data.total;
        this.from = response.data.data.from;
        this.to = response.data.data.to;
        this.isLoading = false;
      });
    }
  }
};
</script>
