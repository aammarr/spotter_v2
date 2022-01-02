<template>
  <div>
    <div class="d-flex justify-content-end TopMargin">
      <!-- {{ date_from }} {{ selected_client }} -->
      <date-picker
        placeholder="Date From"
        input-class="form-control date_picker_height"
        :lang="lang"
        :config="options"
        v-model="date_from"
        confirm
        format="DD-MM-YYYY"
        value-type="YYYY-MM-DD"
        class="ml-2"
        style="width:20%"
      ></date-picker>
      <date-picker
        placeholder="Date To"
        input-class="form-control date_picker_height"
        :lang="lang"
        :config="options"
        v-model="date_to"
        confirm
        format="DD-MM-YYYY"
        value-type="YYYY-MM-DD"
        class="ml-2"
        style="width:20%"
      ></date-picker>
      <multiselect
        v-model="selected_client"
        :options="allClients"
        class="multiselectcustomclass ml-2"
        selectLabel="select"
        deselectLabel="remove"
        :preserve-search="true"
        :maxHeight="200"
        placeholder="Clients"
        :multiple="true"
        label="name"
        track-by="id"
        style="width:25%"
      >
      </multiselect>
      <div class="ml-2">
        <button
          v-if="isFilter"
          type="button"
          class="btn btn-danger mr-2"
          @click="removeFilter"
        >
          <!-- v-if="isFilterApplied" -->
          Remove Filters
        </button>
        <button
          type="button"
          class="btn btn-info"
          @click="applyFilter"
          :disabled="!(date_from || date_to || selected_client)"
        >
          Apply Filters
        </button>
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
      <h3 class="card-title" style="font-weight: 600">Last Fetched Data</h3>
      <b-table
        :items="tableData"
        :fields="fields"
        head-variant="light dark"
        show-empty
        borderless
        @row-selected="onRowSelected"
      >
        <template v-slot:cell(created_at)="row">
          <!-- {{ row.item.created_at.split(" ")[1] }} -->
          {{ row.item.created_at }}
        </template>
        <template v-slot:cell(keyword)="row">
          <b>{{ row.item.keyword }}</b>
        </template>
        <template #cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <b-icon icon="check-square-fill" scale="1" variant="info"></b-icon>
          </template>
          <template v-else>
            <b-icon icon="square" scale="1" variant="info"></b-icon>
          </template>
        </template>
        <!-- <template v-slot:cell(action)="row">
          <button type="button" class="btn bg-light-danger btn-sm">
            <b-icon
              icon="x"
              scale="1.5"
              variant="danger"
              @click="confirmationForSingleRow(row.item.id)"
            ></b-icon>
          </button>
        </template> -->
      </b-table>

      <div class="d-flex justify-content-between" v-if="tableData.length > 0">
        <b-pagination
          v-model="current_page"
          :total-rows="total_records"
          :per-page="per_page.val"
          aria-controls="tableHorizontal"
          @change="handlePagination"
        ></b-pagination>
        <div class="font-size-sm" v-if="total_records > 25">
          {{ `Showing ${per_page.val} of ${total_records}` }}
        </div>
        <div class="font-size-sm" v-if="total_records < 25">
          {{ `Showing ${total_records} of ${total_records}` }}
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";

export default {
  name: "logs",
  data() {
    return {
      isLoading: false,
      current_page: 1,
      per_page: { val: 25, label: "25" },
      total_records: "",
      isFilter: false,
      date_from: null,
      date_to: null,
      selected_client: null,
      lang: "en",
      options: {
        format: "DD/MM/YYYY",
        useCurrent: false
      },
      keyword: [],
      keywordError: false,
      keywordsArray: [],
      fields: [
        {
          key: "created_at",
          label: "DATETIME",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "keyword",
          label: "CLIENT",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "response",
          label: "NO. TWEETS",
          thStyle: { minWidth: "15%" }
        },
        {
          key: "api",
          label: "API",
          thStyle: { minWidth: "15%" }
        }
        // {
        //   key: "action",
        //   label: "",
        //   thStyle: { minWidth: "65%" },
        // },
      ],
      tableData: [],
      selected: [],
      singleSelectedRowID: "",
      allClients: []
    };
  },
  created() {
    this.appUserAction;
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Logs" }]);
    this.getAllClients();
    this.getData();
  },
  methods: {
    /**
     * onRowSelected function
     */
    getClientsId(arr) {
      let ids = [];
      if (arr) {
        arr.forEach(e => {
          ids.push(e.id);
        });
        return ids;
      } else return [];
    },
    getData() {
      this.isLoading = true;
      let dataToPost = {
        date_from: this.date_from,
        date_to: this.date_to,
        clients: this.getClientsId(this.selected_client),
        page: this.current_page,
        per_page: "25"
      };
      ApiService.post(`/logs`, dataToPost).then(response => {
        this.tableData = response.data.data.data;
        this.total_records = response.data.data.total;
        this.isLoading = false;
      });
    },
    onRowSelected(items) {
      this.selected = items;
    },
    /**
     * handlePagination function
     */
    handlePagination(value) {
      this.current_page = value;
      this.getData();
    },
    /**
     * getAllClients function
     */
    getAllClients() {
      ApiService.get(`/clients/getallclients`).then(response => {
        this.allClients = response.data.data.data;
      });
    },

    applyFilter() {
      this.isFilter = true;
      this.current_page = 1;
      this.getData();
      // Note also set te pagination here
    },
    removeFilter() {
      this.date_from = null;
      this.date_to = null;
      this.selected_client = null;
      this.isFilter = false;
      this.getData();
    }
  }
};
</script>
<style scoped>
.img_hw {
  height: 100px;
  width: 100px;
}
.multiselectcustomclass {
  font-size: 9px !important;
}
.filtersTopRightCorner {
  display: flex;
  position: absolute;
  right: 25px;
  top: 85px;
}
.date_picker_height {
  height: 43px;
  border-radius: 10px;
}
</style>
