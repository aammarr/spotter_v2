<template>
  <div>
    <loading :active.sync="isGeneratingPDF"></loading>
    <b-modal
      ref="report_name_modal"
      :centered="true"
      size="md"
      ok-variant="info"
      ok-title="Download"
      @ok="generatePDF"
      :ok-disabled="report_name == ''"
    >
      <b-form-group id="input-group-2">
        <b-form-input
          id="input-3"
          v-model="report_name"
          placeholder="Enter Report Name"
          required
        ></b-form-input>
      </b-form-group>
    </b-modal>
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
    <div class="d-flex justify-content-end mb-3 TopMargin">
      <b-button small v-b-modal.addcouponmodal variant="info"
        >Upload Coupon</b-button
      >
      <div class="mr-2 ml-2" style="width: 400px">
        <multiselect
          v-model="sheet"
          :options="sheetNamesArray"
          class="multiselectcustomclass mr-3"
          @input="getReportData"
          selectLabel="select"
          deselectLabel="remove"
          :preserve-search="true"
          :maxHeight="200"
          :maxWidth="150"
          placeholder="Uploaded Coupons"
          label="sheet_name"
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
      <a
        href="javascript:void(0)"
        class="btn btn-default float-right"
        @click="toggleModal()"
      >
        <inline-svg src="media/svg/icons/Files/Download.svg" />
      </a>
    </div>
    <b-card v-if="isLoading" class="mt-5">
      <b-skeleton-table
        :rows="5"
        :columns="4"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
    </b-card>

    <b-card v-if="!isLoading" class="mt-5">
      <b-table
        id="tableHorizontal"
        :items="tableData"
        :fields="fields"
        head-variant="light dark"
        show-empty
        borderless
      >
        <template v-slot:cell(s_no)="row">
          {{ row.index + 1 }}
        </template>
        <template v-slot:cell(sheet_name)="row">
          <b>{{ row.item.sheet_name }}</b>
        </template>
        <template v-slot:cell(media_url)="row">
          <img
            class="img_hw"
            v-if="row.item.media_url"
            :src="row.item.media_url"
            onerror="this.src='media/images/image_not_found.png'"
          />
          <p v-else>No Media Url</p>
        </template>
      </b-table>
    </b-card>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";
import { validationMixin } from "vuelidate";
import { url, required } from "vuelidate/lib/validators";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "pdfreport",
  components: { Loading },
  mixins: [validationMixin],
  data() {
    return {
      temp: "",
      isLoading: false,
      isGeneratingPDF: false,
      isSubmitFormLoading: false,
      fields: [
        { key: "s_no", label: "S.No", thStyle: { minWidth: "10%" } },
        {
          key: "coupon_name",
          label: "Coupon",
          thStyle: { minWidth: "10%" }
        },
        {
          key: "frequency",
          label: "No. Spams",
          thStyle: { minWidth: "10%" }
        },
        { key: "media_url", label: "Media", thStyle: { minWidth: "10%" } },
        {
          key: "most_frequent_spammer",
          label: "Most Frequent Spammer",
          thStyle: { minWidth: "10%" }
        }
      ],
      tableData: [],
      report_name: "",
      sheetNamesArray: [],
      sheet: null,
      form: {
        sheet_url: "",
        sheet_name: ""
      }
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
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Report" }]);
    this.getAllgsheets();
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    getAllgsheets() {
      ApiService.get("/gsheet-logs/names/get").then(response => {
        this.sheetNamesArray = response.data.data;
      });
    },
    resetForm() {
      this.isLoading = false;

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    closeModal() {
      this.$refs["addcouponmodal"].hide();
      this.resetForm();
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
    toggleModal() {
      this.report_name = "";
      this.$refs["report_name_modal"].toggle();
    },
    generatePDF() {
      this.isGeneratingPDF = true;
      let data = [];
      this.tableData.forEach((val, index) => {
        data.push({
          sno: index + 1,
          coupon: val.coupon_name,
          frequencyofspam: val.frequency,
          media: val.media_url,
          most_frequent_spammer: val.most_frequent_spammer
        });
      });
      let dataToPost = {
        title: this.report_name,
        data: data
      };
      ApiService.post(`/getpdf`, dataToPost).then(response => {
        let pdf_url = response.data.data;
        window.open(`${pdf_url}`, "_blank");
        this.isGeneratingPDF = false;
      });
    },
    getReportData() {
      this.isLoading = true;
      let sheet_log_id = this.sheet.id;
      ApiService.get(`/getreport?sheet_log_id=${sheet_log_id}`).then(
        response => {
          this.tableData = response.data.data;
          this.temp = this.tableData;
          this.isLoading = false;
        }
      );
    }
  }
};
</script>
<style scoped>
.img_hw {
  height: 50px;
  width: 50px;
}
.multiselectcustomclass {
  font-size: 9px !important;
}
</style>
