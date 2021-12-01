<template>
  <div>
    <b-card>
      <h3 class="card-title" style="font-weight: 600">
        Delete Whitelisted User
      </h3>
      <hr />
      <b-form class="mt-10">
        <b-form-group>
          <div class="d-flex justify-content-start">
            <h5 class="mt-2 text-dark" style="font-weight: 600">
              Twitter Usernames
            </h5>
            <b-icon
              icon="info-circle-fill"
              scale="1"
              class="mt-3 ml-2"
              variant="info"
              v-b-tooltip.click="'You can add multiple values.'"
            ></b-icon>
          </div>
          <multiselect
            id="valid_userid"
            v-model="valid_userid"
            class="mb-2"
            tag-placeholder="Add this as new tag"
            placeholder="Please enter twitter handles you want to delete"
            label="username"
            track-by="unique_code"
            :options="valid_userid"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
          ></multiselect>
        </b-form-group>
      </b-form>

      <b-button
        type="button"
        variant="info"
        class="float-right"
        :disabled="valid_userid.length == 0"
        @click="confirmation('submit_btn')"
        >Submit</b-button
      >
    </b-card>
    <b-card v-if="isLoading" class="mt-3">
      <b-skeleton-table
        :rows="5"
        :columns="6"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
    </b-card>
    <b-card v-if="!isLoading" class="mt-3">
      <div class="d-flex justify-content-between mb-2">
        <h2>Whitelisted Users</h2>
        <button
          type="button"
          class="btn border border-danger"
          @click="confirmation('delete_btn')"
          v-if="selected.length > 0"
        >
          <img src="media/images/other_icons/btn_close.svg" class="mr-2" />
          <span class="text-danger">Delete Selected</span>
        </button>
      </div>

      <b-table
        :items="tableData"
        :fields="fields"
        head-variant="light dark"
        show-empty
        selectable
        borderless
        @row-selected="onRowSelected"
      >
        <template v-slot:cell(sno)="row">
          {{ row.index + 1 }}
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
              @click="confirmationForSingleRow(row.item.username)"
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
  name: "deletevalidusername",
  data() {
    return {
      isLoading: false,
      current_page: 1,
      per_page: { val: 25, label: "25" },
      from: "",
      to: "",
      total_records: "",
      filter: "",
      valid_userid: [],
      valid_userid_options: [],
      headVariant: "light",
      fields: [
        {
          key: "selected",
          label: "Selected",
          thStyle: { minWidth: "100px" }
        },
        {
          key: "sno",
          label: "S.No",
          thStyle: { minWidth: "100px" }
        },
        {
          key: "updated_at",
          label: "Date",
          thStyle: { minWidth: "250px" }
        },
        {
          key: "name",
          label: "Name",
          thStyle: { minWidth: "200px" }
        },
        {
          key: "username",
          label: "Twitter handle",
          thStyle: { minWidth: "250px" }
        },
        {
          key: "action",
          label: "Action",
          thStyle: { minWidth: "100px" }
        }
      ],
      tableData: [],
      selected: [],
      singleSelectedRowID: ""
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Tweet Authors" }]);
    this.getAllInValidUsers();
  },
  methods: {
    confirmation(btn) {
      this.$swal
        .fire({
          icon: "warning",
          text: "Are you sure you want to delete this user(s)?",
          showCancelButton: true
        })
        .then(result => {
          if (result.isConfirmed) {
            if (btn == "delete_btn") {
              this.deleteRecords();
            }
            if (btn == "submit_btn") {
              this.onSubmit();
            }
          }
        });
    },
    confirmationForSingleRow(username) {
      this.singleSelectedRowID = username;
      this.$swal
        .fire({
          icon: "warning",
          text: "Are you sure you want to delete this user(s)?",
          showCancelButton: true
        })
        .then(result => {
          if (result.isConfirmed) {
            this.onSubmit();
          }
        });
    },
    onRowSelected(items) {
      this.selected = items;
    },
    addTag(newTag) {
      let tag = {
        username: newTag,
        unique_code:
          newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.valid_userid_options.push(tag);
      this.valid_userid.push(tag);
    },
    async onSubmit() {
      this.isLoading = true;
      let usernames = [];
      if (this.singleSelectedRowID == "") {
        this.valid_userid.forEach(val => {
          usernames.push(val.username);
        });
      } else {
        usernames.push(this.singleSelectedRowID);
      }

      let dataToPost = {
        usernames: usernames
      };
      await ApiService.post(`/users/removevalid`, dataToPost).then(res => {
        if (res.data.success == true) {
          this.isLoading = false;
          this.showMsg("info", res.data.data);
          this.valid_userid = [];
          this.getAllInValidUsers();
        }
      });
    },
    async deleteRecords() {
      this.isLoading = true;
      let usernames = [];

      this.selected.forEach(val => {
        usernames.push(val.username);
      });
      let dataToPost = {
        usernames: usernames
      };
      await ApiService.post(`/users/removevalid`, dataToPost).then(res => {
        if (res.data.success == true) {
          this.isLoading = false;
          this.showMsg("info", res.data.data);
          this.selected = [];
          this.getAllInValidUsers();
        }
      });
    },
    async getAllInValidUsers() {
      this.isLoading = true;
      let query_string =
        "is_valid=true&per_page=" +
        this.per_page.val +
        "&page=" +
        this.current_page;
      let response = await ApiService.get("/gettwitterusers?" + query_string);
      this.tableData = response.data.data.data;
      this.total_records = response.data.data.total;
      this.from = response.data.data.from;
      this.to = response.data.data.to;
      this.isLoading = false;
    },
    showMsg(type, data) {
      let invalid_users = "";
      let valid_users = "";
      let valided_user = "";
      if (data.invalid_users.count > 0) {
        // invalid_users = `${data.invalid_users.usernames} - Twitter handle not found in the database`;
        invalid_users = data.invalid_users.message;
      }
      if (data.valid_users.count > 0) {
        // valid_users = `${data.valid_users.usernames} - Successfully removed`;
        valid_users = data.valid_users.message;
      }
      if (data.valided_user.count > 0) {
        // valided_user = `${data.valided_user.usernames} - Already added to Valid Users`;
        valided_user = data.valided_user.message;
      }
      this.$swal
        .fire({
          icon: type,
          html: `<div>${valid_users}</div><div>${invalid_users}</div><div>${valided_user}</div>`
        })
        .then(result => {
          if (result.isConfirmed) {
            if (type == "success") {
              this.resetForm();
            }
          }
        });
    },
    resetForm() {
      this.valid_userid = [];
      this.valid_userid_options = [];
    },
    nextBtn() {
      this.current_page += 1;
      this.getAllInValidUsers();
    },
    prevBtn() {
      this.current_page -= 1;
      this.getAllInValidUsers();
    },
    handlePagination(value) {
      this.current_page = value;
      this.getAllInValidUsers();
    }
  }
};
</script>

<style scoped>
.btn-text {
  font-weight: bold;
}
.table-active > tr > td {
  background-color: rgb(255 244 247) !important;
}
</style>
