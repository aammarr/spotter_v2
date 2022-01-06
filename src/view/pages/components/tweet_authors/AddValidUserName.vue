<template>
  <div>
    <b-card>
      <h3 class="card-title" style="font-weight: 600">Add Whitelisted User</h3>
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
            placeholder="Add Twitter handle you want to whitelist"
            label="user_id"
            track-by="unique_code"
            :options="valid_userid"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
          ></multiselect>
          <p v-if="errorMsg" class="text-danger p-0 ml-2">
            Twitter username is required.
          </p>
        </b-form-group>
        <b-button
          type="button"
          @click="onSubmit"
          variant="info"
          class="float-right"
          >Submit</b-button
        >
      </b-form>
    </b-card>
    <b-card v-if="isLoading" class="mt-3">
      <b-skeleton-table
        :rows="5"
        :columns="6"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
    </b-card>
    <b-card v-if="!isLoading" class="mt-3" style="min-height: 350px">
      <h2>Whitelisted Users</h2>
      <b-table
        :items="tableData"
        :fields="fields"
        head-variant="light dark"
        borderless
        show-empty
      >
        <template v-slot:cell(sno)="row">
          {{ from > 1 ? row.index + from : row.index + 1 }}
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
  name: "addvalidusername",
  data() {
    return {
      isLoading: false,
      errorMsg: false,
      current_page: 1,
      per_page: { val: 25, label: "25" },
      total_records: "",
      from: "",
      to: "",
      filter: "",
      valid_userid: [],
      valid_userid_options: [],
      headVariant: "light",
      fields: [
        {
          key: "sno",
          label: "S.No",
          thStyle: { minWidth: "250px" }
        },
        {
          key: "updated_at",
          label: "Date",
          thStyle: { minWidth: "250px" }
        },
        {
          key: "name",
          label: "Name",
          thStyle: { minWidth: "250px" }
        },
        {
          key: "username",
          label: "Twitter handle",
          thStyle: { minWidth: "250px" }
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Tweet Authors" }]);
    this.getAllValidUsers();
  },
  methods: {
    addTag(newTag) {
      let tag = {
        user_id: newTag,
        unique_code:
          newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.valid_userid_options.push(tag);
      this.valid_userid.push(tag);
    },

    async onSubmit() {
      if (this.valid_userid.length < 1) {
        this.errorMsg = true;
        let that = this;
        setTimeout(function() {
          that.errorMsg = false;
        }, 3000);
        return;
      }
      this.isLoading = true;
      let usernames = [];
      this.valid_userid.forEach(val => {
        usernames.push(val.user_id);
      });
      let dataToPost = {
        usernames: usernames
      };
      await ApiService.post(`/users/addvalid`, dataToPost).then(res => {
        if (res.data.success == true) {
          this.isLoading = false;
          this.showMsg("info", res.data.data);
        }
      });
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
        // valid_users = `${data.valid_users.usernames} - Successfully added to Valid Users`;
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
    async getAllValidUsers() {
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
    nextBtn() {
      this.current_page += 1;
      this.getAllValidUsers();
    },
    prevBtn() {
      this.current_page -= 1;
      this.getAllValidUsers();
    },
    handlePagination(value) {
      this.current_page = value;
      this.getAllValidUsers();
    }
  }
};
</script>
