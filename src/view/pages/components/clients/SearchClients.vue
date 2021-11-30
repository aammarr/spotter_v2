<template>
  <div>
    <!-- <div class="form-group">
      <multiselect
        v-model="selectedClients"
        :options="allClients"
        class="multiselectcustomclass"
        selectLabel="select"
        deselectLabel="remove"
        :multiple="true"
        :preserve-search="true"
        :maxHeight="200"
        placeholder="Clients"
        @input="searchClient"
        label="name"
        track-by="id"
      >
        <template slot="selection" slot-scope="{ values, isOpen }"
          ><span
            class="multiselect__single"
            v-if="values.length &amp;&amp; !isOpen"
            >{{ values.length }} selected</span
          ></template
        >
      </multiselect>
    </div>

    <div v-if="errMsgEnable" class="text-danger">
      {{ errMsg }}
    </div> -->
    <b-card style="min-height: 350px">
      <div v-if="isLoading">
        <b-skeleton-table
          :rows="5"
          :columns="6"
          :table-props="{ bordered: true, striped: true }"
        ></b-skeleton-table>
      </div>
      <div v-if="!isLoading">
        <b-table
          class="table table-reponsive table-custom"
          :items="allClients"
          :fields="fields"
          head-variant="light dark"
          show-empty
          borderless
        >
          <template v-slot:cell(sr_num)="row">
            {{ getSerialNo(row.index) }}
          </template>
          <template v-slot:cell(image)="row">
            <span v-if="row.item.media_url !== null">
              <a href="javascript:void(0)">
                <img
                  class="img_hw"
                  :src="row.item.image"
                  style="
                    height: 50px;
                    width: 50px;
                    border: 1px transparent;
                    border-radius: 12px;
                  "
                  onerror="this.src='media/images/image_not_found.png'"
                />
              </a>
            </span>
            <p v-else>No Media Url</p>
          </template>
          <template v-slot:cell(created_at)="row">
            {{ getDateOnly(row.value) }}
          </template>
        </b-table>

        <div
          class="d-flex justify-content-between"
          v-if="allClients.length > 0"
        >
          <b-pagination
            v-model="current_page"
            :total-rows="total_records"
            :per-page="per_page.val"
            aria-controls="tableHorizontal"
            @change="handlePageChange"
          ></b-pagination>
          <div class="font-size-sm">
            {{ `Showing ${from} to ${to} of ${total_records}` }}
          </div>
        </div>
      </div>
    </b-card>
    <div style="height: 80px; visibility: hidden"></div>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";

export default {
  name: "searchclients",
  data() {
    return {
      isLoading: false,
      headVariant: "light",
      client: "",
      prev_page: "",
      current_page: 1,
      next_page: "",
      last_page: "",
      filter: "",
      counter: 1,
      per_page: { val: 25, label: "25" },
      total_records: "",
      from: "",
      to: "",
      tableData: [],
      allClients: [],
      selectedClients: [],
      fields: [
        {
          key: "sr_num",
          label: "SR.NO",
          thStyle: { minWidth: "250px", textAlign: "center" }
        },
        {
          key: "name",
          label: "Client Name",
          thStyle: { minWidth: "200px", textAlign: "center" }
        },
        {
          key: "image",
          label: "Client Logo",
          thStyle: { minWidth: "150px", textAlign: "center" }
        },
        {
          key: "created_at",
          label: "DATE ADDED",
          thStyle: { minWidth: "200px", textAlign: "center" }
        }
      ],
      errMsgEnable: false,
      errMsg: ""
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Clients" }]);
    this.getAllClients();
  },
  methods: {
    getDateOnly(value) {
      value = value.split(" ")[0];
      return value;
    },
    getSerialNo(index) {
      index = index += 1;
      return index;
    },
    async getAllClients() {
      let response = await ApiService.get(
        `/clients/getallclients?current_page=${this.current_page}&per_page=${this.per_page.val}`
      );
      this.allClients = response.data.data.data;
      this.total_records = response.data.data.total;
      this.from = response.data.data.from;
      this.to = response.data.data.to;
    },
    handlePageChange(value) {
      this.current_page = value;
      this.getAllClients();
    },
    async searchClient() {
      this.isLoading = true;
      let selectedClients = [];
      this.selectedClients.forEach(val => {
        selectedClients.push(val.id);
      });
      let response = await ApiService.get(
        `/clients/search?name=${selectedClients}&page=${this.current_page}`
      );
      this.tableData = response.data.data;
      this.isLoading = false;
    }
  }
};
</script>
<style scoped>
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
}
</style>
