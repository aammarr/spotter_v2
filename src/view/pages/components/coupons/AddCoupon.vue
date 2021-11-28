<template>
  <div>
    <b-modal id="addcouponmodal" ref="addcouponmodal" hide-footer>
      <b-alert variant="secondary" show dismissible fade>
        <strong>Note: </strong> Please make sure the sheet is shared with
        <strong>
          phpsheets@spotter-sheets-integration.iam.gserviceaccount.com
        </strong>
        email address before uploading.
        <br />
        <br />
        Please click on this link to view a
        <strong
          ><a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1yzqenn4oGV4jZL4DOU8SwZ6i6Vw47vpwMrsR3On2_VQ/edit#gid=0"
            >sample sheet</a
          ></strong
        >
      </b-alert>
      <b-form @submit.stop.prevent="submitForm">
        <b-form-group id="example-input-group-1" label="" label-for="sheet_url">
          <b-form-input
            type="text"
            name="sheet_url"
            id="sheet_url"
            class="form-control form-control-solid h-auto"
            v-model="$v.form.sheet_url.$model"
            :state="validateState('sheet_url')"
            placeholder="Please enter the Google Sheet URL"
          ></b-form-input>
          <b-form-invalid-feedback id="input-1-live-feedback">
            Please Enter Sheet URL.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="example-input-group-2"
          label=""
          label-for="sheet_name"
        >
          <b-form-input
            type="text"
            name="sheet_name"
            id="sheet_name"
            class="form-control form-control-solid h-auto"
            v-model="$v.form.sheet_name.$model"
            :state="validateState('sheet_name')"
            placeholder="Please enter the coupon containing sheet name"
          ></b-form-input>
          <p class="m-0 p-0" style="color: #cfcfcf">
            This should be same as Google Sheet
          </p>
          <b-form-invalid-feedback id="input-2-live-feedback">
            <p v-if="!$v.form.sheet_name.required">
              Sheet Name is required.
            </p>
            <p v-else>Please enter alphabets and numeric only.</p>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-button
          type="button"
          class="float-right ml-2"
          variant="secondary"
          @click="closeModal()"
          >Close</b-button
        >
        <b-button
          type="submit"
          class="float-right"
          :class="
            isSubmitFormLoading ? 'spinner spinner-light spinner-right' : ''
          "
          variant="info"
          >Submit</b-button
        >
      </b-form>
    </b-modal>
    <div class="d-flex justify-content-end mb-3 TopMargin" style="">
      <b-button v-b-modal.addcouponmodal variant="info">Upload Coupon</b-button>
    </div>
    <b-card v-if="isLoading" class="mt-3">
      <b-skeleton-table
        :rows="5"
        :columns="6"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
    </b-card>

    <b-card v-if="!isLoading" class="mt-8">
      <b-table
        :items="tableData"
        :fields="fields"
        head-variant="light dark"
        show-empty
        borderless
      >
        <template v-slot:cell(id)="row">
          <b>{{ row.item.id }}</b>
        </template>
        <template v-slot:cell(sheet_name)="row">
          <b>{{ row.item.sheet_name }}</b>
        </template>
        <template v-slot:cell(action)="row">
          <button type="button" class="btn bg-light-danger btn-sm">
            <b-icon
              icon="x"
              scale="1.5"
              variant="danger"
              @click="confirmation(row.index)"
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
import { validationMixin } from "vuelidate";
import { url, required } from "vuelidate/lib/validators";

export default {
  name: "addcoupon",
  mixins: [validationMixin],
  data() {
    return {
      isLoading: false,
      isSubmitFormLoading: false,
      current_page: 1,
      per_page: { val: 10, label: "10" },
      total_records: "",
      from: "",
      to: "",
      headVariant: "light",
      form: {
        sheet_url: "",
        sheet_name: ""
      },
      fields: [
        {
          key: "id",
          label: "ID",
          thStyle: { minWidth: "10%" }
        },
        {
          key: "sheet_name",
          label: "Sheet Name",
          thStyle: { minWidth: "60%" }
        },
        {
          key: "action",
          label: "",
          thStyle: { minWidth: "20%" }
        }
      ],
      tableData: []
    };
  },
  validations: {
    form: {
      sheet_url: {
        required,
        url
      },
      sheet_name: {
        required
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Upload Coupon" }]);
    this.getAllgsheets();
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    closeModal() {
      this.$refs["addcouponmodal"].hide();
      this.resetForm();
    },
    confirmation(index) {
      let selectedRow = this.tableData[index];
      this.$swal
        .fire({
          icon: "warning",
          title: "",
          text: `Are you sure you want to delete this sheet: ${selectedRow.sheet_name} `,
          showCancelButton: true
        })
        .then(result => {
          if (result.isConfirmed) {
            this.deleteCoupon(selectedRow.id);
          }
        });
    },
    resetForm() {
      this.form = {
        sheet_url: "",
        sheet_name: ""
      };
      this.isLoading = false;

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    submitForm() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.isSubmitFormLoading = true;
      ApiService.get(
        `/coupons/upload?sheetname=${this.form.sheet_name}&sheeturl=${this.form.sheet_url}`
      ).then(res => {
        if (res.data) {
          this.isSubmitFormLoading = false;
          let type = res.data.status == 0 ? "error" : "success";
          this.showMsg(type, res.data.message);
        }
      });
    },
    showMsg(type, msg) {
      this.$swal
        .fire({
          icon: type,
          title: msg,
          allowOutsideClick: false,
          allowEscapeKey: false
        })
        .then(result => {
          if (result.isConfirmed) {
            this.closeModal();
            this.resetForm();
            this.getAllgsheets();
          }
        });
    },
    deleteCoupon(id) {
      ApiService.get(`/coupons/deleteUploadedCoupons/${id}`).then(res => {
        if (res.data.status == "Success") {
          this.$swal.fire({
            icon: "success",
            title: "Successfully Deleted"
          });
          this.getAllgsheets();
        } else {
          this.$swal.fire({
            icon: "info",
            title: "",
            text: res.data.message
          });
          this.getAllgsheets();
        }
      });
    },
    async getAllgsheets() {
      let query_string =
        "is_valid=false&per_page=" +
        this.per_page.val +
        "&page=" +
        this.current_page;
      let response = await ApiService.get(
        "/gsheet-logs/names/get?" + query_string
      );
      this.tableData = response.data.data;
      this.total_records = response.data.total;
      this.from = response.data.from;
      this.to = response.data.to;
    },
    handlePagination(value) {
      this.current_page = value;
      this.getAllgsheets();
    }
  }
};
</script>
