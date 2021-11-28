<template>
  <div>
    <b-modal id="addkeywordmodal" ref="addkeywordmodal" hide-footer>
      <template #modal-title> New Keyword </template>
      <b-form>
        <b-form-group id="keyword">
          <multiselect
            id="arabic_name"
            v-model="keyword"
            class="mb-2"
            tag-placeholder="Add this as new tag"
            placeholder="Enter a keyword"
            label="name"
            track-by="unique_code"
            :options="keyword"
            :multiple="true"
            :taggable="true"
            @tag="addKeyword"
          ></multiselect>
          <div class="text-danger" v-if="keywordError">
            Please Enter Keywords
          </div>
        </b-form-group>

        <b-button
          type="button"
          class="float-right ml-2"
          variant="secondary"
          @click="closeModal()"
          >Close</b-button
        >
        <b-button
          type="button"
          class="float-right"
          variant="info"
          @click="submitForm"
          >Add</b-button
        >
      </b-form>
    </b-modal>
    <div class="d-flex justify-content-end TopMargin mb-3">
      <button
        type="button"
        class="btn border border-danger mr-3"
        @click="confirmation"
        v-if="selected.length > 0"
      >
        <img src="media/images/other_icons/btn_close.svg" class="mr-2" />
        <span class="text-danger">Delete Selected</span>
      </button>
      <b-button v-b-modal.addkeywordmodal variant="info"
        >Add New Keyword</b-button
      >
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
        head-variant="light dark"
        show-empty
        selectable
        borderless
        @row-selected="onRowSelected"
      >
        <template v-slot:cell(ad_keyword)="row">
          <b>{{ row.item.ad_keyword }}</b>
        </template>
        <template #cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <b-icon icon="check-square-fill" scale="1" variant="info"></b-icon>
          </template>
          <template v-else>
            <b-icon icon="square" scale="1" variant="info"></b-icon>
          </template>
        </template>
        <template v-slot:cell(action)="row">
          <button type="button" class="btn bg-light-danger btn-sm">
            <b-icon
              icon="x"
              scale="1.5"
              variant="danger"
              @click="confirmationForSingleRow(row.item.id)"
            ></b-icon>
          </button>
        </template>
      </b-table>

      <div class="d-flex justify-content-between" v-if="tableData.length > 0">
        <b-pagination
          v-model="current_page"
          :total-rows="total_records"
          :per-page="per_page.val"
          aria-controls="tableHorizontal"
          @change="handlePagination"
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
  name: "keyword",
  data() {
    return {
      isLoading: false,
      current_page: 1,
      per_page: { val: 25, label: "25" },
      total_records: "",
      from: "",
      to: "",
      filter: "",
      keyword: [],
      keywordError: false,
      keywordsArray: [],
      fields: [
        {
          key: "selected",
          label: "SELECT",
          thStyle: { minWidth: "5%" }
        },
        {
          key: "ad_keyword",
          label: "KEYWORDS",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "created_at",
          label: "DATE ADDED",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "action",
          label: "",
          thStyle: { minWidth: "65%" }
        }
      ],
      tableData: [],
      selected: [],
      singleSelectedRowID: ""
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Keywords" }]);
    this.getAllKeywords();
  },
  methods: {
    onRowSelected(items) {
      this.selected = items;
    },
    confirmation() {
      this.$swal
        .fire({
          icon: "warning",
          text: "Are you sure you want to delete this keyword(s)?",
          showCancelButton: true
        })
        .then(result => {
          if (result.isConfirmed) {
            this.deleteKeyword();
          }
        });
    },
    confirmationForSingleRow(id) {
      this.singleSelectedRowID = id;
      this.$swal
        .fire({
          icon: "warning",
          text: "Are you sure you want to delete this keyword(s)?",
          showCancelButton: true
        })
        .then(result => {
          if (result.isConfirmed) {
            this.deleteKeyword();
          }
        });
    },
    addKeyword(newTag) {
      let tag = {
        name: newTag,
        unique_code:
          newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.keywordsArray.push(tag);
      this.keyword.push(tag);
    },
    deleteKeyword() {
      let ids = [];
      if (this.singleSelectedRowID == "") {
        this.selected.forEach(val => {
          ids.push(val.id);
        });
      } else {
        ids.push(this.singleSelectedRowID);
      }

      let dataToPost = {
        ids: ids
      };
      ApiService.post(`/tweets/remove/removeadkeywords`, dataToPost).then(
        res => {
          if (res.data.status == "Success") {
            this.closeModal();
            this.isLoading = false;
            this.getAllKeywords();
            this.selected = [];
            this.singleSelectedRowID = "";
          }
        }
      );
    },
    closeModal() {
      this.$refs["addkeywordmodal"].hide();
      this.resetForm();
    },
    resetForm() {
      this.keyword = [];
      this.keywordError = false;
      this.isLoading = false;
    },
    validateForm() {
      if (this.keyword.length == 0) {
        this.keywordError = true;
        return false;
      }
      return true;
    },
    async getAllKeywords() {
      this.isLoading = true;
      await ApiService.get(`tweets/get/adkeywords`).then(res => {
        if (res.data.status == "Success") {
          this.tableData = res.data.data.data;
          this.total_records = res.data.data.total;
          this.from = res.data.data.from;
          this.to = res.data.data.to;
          this.isLoading = false;
        }
      });
    },
    submitForm() {
      if (!this.validateForm()) {
        return;
      }
      this.isLoading = true;
      let keywords = [];
      this.keyword.forEach(val => {
        keywords.push(val.name);
      });
      let dataToPost = {
        keywords: keywords
      };
      ApiService.post(`/tweets/add/adkeyword`, dataToPost).then(res => {
        if (res.data.status == "Success") {
          this.closeModal();
          this.isLoading = false;
          this.getAllKeywords();
        }
      });
    },
    handlePagination(value) {
      this.current_page = value;
      this.getAllKeywords();
    }
  }
};
</script>
<style scoped>
.multiselectcustomclass {
  font-size: 9px !important;
}
</style>
