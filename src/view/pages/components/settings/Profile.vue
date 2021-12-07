<template>
  <div>
    <b-modal
      id="profilepicturemodal"
      ref="profilepicturemodal"
      title="Update Picture"
      hide-footer
    >
      <cropper
        class="cropper"
        ref="cropper"
        :src="profileImage"
        @change="change"
        stencil-component="circle-stencil"
        :stencil-props="{
          handlers: {
            eastNorth: true,
            north: false,
            westNorth: true,
            west: false,
            westSouth: true,
            south: false,
            eastSouth: true,
            east: false
          }
        }"
      />
      <label class="mt-2" style="cursor: pointer">
        <b-icon icon="pencil" scale="1" variant="info" class="mr-2"></b-icon>
        Select Image
        <input
          type="file"
          id="file-upload"
          @change="onFileChanged"
          accept="image/jpeg, image/png"
        />
      </label>
      <div class="mt-2">
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
          @click="updateProfileData"
          variant="info"
          >Submit</b-button
        >
      </div>
    </b-modal>
    <div class="row">
      <!-- left panel -->
      <div class="col-md-3">
        <div class="card border-0" style="min-height: 600px; max-height: 600px">
          <div class="card-body p-0">
            <div class="d-flex justify-content-center align-items-center mt-5">
              <img
                class="readonly_profile_image"
                :src="
                  profileData.profile_picture
                    ? profileData.profile_picture
                    : 'https://gracecourtschools.org/static/img/avatar.png'
                "
              />
            </div>
            <div class="text-center mt-2">
              <h4 style="font-weight: 600">{{ this.profileData.name }}</h4>
              <p class="text-muted">{{ this.profileData.email }}</p>
            </div>
            <div class="mt-3 p-0 m-0">
              <ul class="list-group">
                <li
                  class="
                    list-group-item
                    border-right-0 border-left-0
                    d-flex
                    justify-content-start
                    align-items-center
                  "
                >
                  <span class="badge" id="tooltip_1">
                    <img
                      style="height: 25px; width: 25px"
                      src="media/images/profile_icons/icon_job.svg"
                    />
                  </span>
                  <b-tooltip
                    target="tooltip_1"
                    triggers="hover"
                    placement="right"
                  >
                    Job Title
                  </b-tooltip>
                  <b class="ml-2">{{
                    this.profileData.job_title
                      ? this.profileData.job_title
                      : "-"
                  }}</b>
                </li>
                <li
                  class="
                    list-group-item
                    border-right-0 border-left-0
                    d-flex
                    justify-content-start
                    align-items-center
                  "
                >
                  <span class="badge" id="tooltip_2">
                    <img
                      style="height: 25px; width: 25px"
                      src="media/images/profile_icons/icon_job.svg"
                    />
                  </span>
                  <b-tooltip
                    target="tooltip_2"
                    triggers="hover"
                    placement="right"
                  >
                    Spotter User Role
                  </b-tooltip>
                  <b class="ml-2">{{
                    this.profileData.role ? this.profileData.role : "-"
                  }}</b>
                </li>
                <li
                  class="
                    list-group-item
                    border-right-0 border-left-0
                    d-flex
                    justify-content-start
                    align-items-center
                  "
                >
                  <span class="badge" id="tooltip_3">
                    <img
                      style="height: 25px; width: 25px"
                      src="media/images/profile_icons/icon_team.svg"
                    />
                  </span>
                  <b-tooltip
                    target="tooltip_3"
                    triggers="hover"
                    placement="right"
                  >
                    Department
                  </b-tooltip>
                  <b class="ml-2"
                    >{{
                      this.profileData.department
                        ? this.profileData.department
                        : "-"
                    }}
                  </b>
                </li>
                <li
                  class="
                    list-group-item
                    border-right-0 border-left-0
                    d-flex
                    justify-content-start
                    align-items-center
                  "
                >
                  <span class="badge" id="tooltip_4">
                    <img
                      style="height: 25px; width: 25px"
                      src="media/images/profile_icons/icon_location.svg"
                    />
                  </span>
                  <b-tooltip
                    target="tooltip_4"
                    triggers="hover"
                    placement="right"
                  >
                    Location
                  </b-tooltip>
                  <b class="ml-2">{{
                    this.profileData.location ? this.profileData.location : "-"
                  }}</b>
                </li>
                <li
                  class="
                    list-group-item
                    border-right-0 border-left-0
                    d-flex
                    justify-content-start
                    align-items-center
                  "
                >
                  <span class="badge" id="tooltip_5">
                    <img
                      style="height: 25px; width: 25px"
                      src="media/images/profile_icons/icon_company.svg"
                    />
                  </span>
                  <b-tooltip
                    target="tooltip_5"
                    triggers="hover"
                    placement="right"
                  >
                    Company
                  </b-tooltip>
                  <b class="ml-2">{{
                    this.profileData.company ? this.profileData.company : "-"
                  }}</b>
                </li>
              </ul>
              <div
                class="d-flex justify-content-center align-items-center mt-5"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- right panel -->
      <div class="col-md-9">
        <b-tabs active-nav-item-class="text-info font-weight-bold border-0 m-0">
          <!-- Personal Information -->
          <b-tab title="Personal Information">
            <div
              class="card border-0"
              style="min-height: 560px; max-height: 560px"
            >
              <div class="card-body" style="position: relative">
                <!-- <button
                  :class="(isEdit ? 'btn-info ' : 'btn-primary ') + 'btn'"
                  style="position: absolute;right:20px"
                  @click="isEdit = !isEdit"
                >
                  {{ isEdit ? "Editable" : "Uneditable" }}
                </button> -->
                <h4 style="font-weight: 600">Personal Information</h4>
                <p class="text-muted">Update Your Personal Information</p>
                <div class="row">
                  <div style="position: relative">
                    <img
                      :src="
                        profileData.profile_picture
                          ? profileData.profile_picture
                          : 'https://gracecourtschools.org/static/img/avatar.png'
                      "
                      style="
                        height: 120px;
                        width: 120px;
                        border: none;
                        border-radius: 80px;
                      "
                    />
                    <label
                      class="profile_image_edit_icon"
                      v-b-modal.profilepicturemodal
                    >
                      <b-icon icon="pencil-square" scale="1" variant="light">
                      </b-icon>
                      <!-- <input
                        type="file"
                        id="file-upload"
                        @change="onFileChanged"
                        accept="image/jpeg, image/png"
                      /> -->
                    </label>
                  </div>
                </div>
                <b-form class="form" @submit.stop.prevent="updateProfileData">
                  <div class="row" style="margin-top: 3rem !important">
                    <!-- First Name -->
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="firstname"
                        >
                          First Name
                        </label>
                        <span
                          :class="isEdit.class"
                          @click="isEdit.firstname = !isEdit.firstname"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="firstname"
                          name="firstname"
                          :disabled="isEdit.firstname"
                          v-model="$v.form.firstname.$model"
                          :state="validateState('firstname')"
                          aria-describedby="input-1-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                          <p v-if="!$v.form.firstname.required">
                            First Name is required.
                          </p>
                          <p v-else>Please enter alphabets only.</p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                    <!-- Middle Name -->
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="middlename"
                          >Middle Name</label
                        ><span
                          :class="isEdit.class"
                          @click="isEdit.middlename = !isEdit.middlename"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="middlename"
                          name="middlename"
                          :disabled="isEdit.middlename"
                          :state="validateState('middlename')"
                          v-model="$v.form.middlename.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                          <p>Please enter alphabets only.</p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                    <!-- Last Name -->
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="lastname"
                          >Last Name</label
                        ><span
                          :class="isEdit.class"
                          @click="isEdit.lastname = !isEdit.lastname"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="lastname"
                          name="lastname"
                          :disabled="isEdit.lastname"
                          v-model="$v.form.lastname.$model"
                          :state="validateState('lastname')"
                          aria-describedby="input-3-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-3-live-feedback">
                          <p v-if="!$v.form.lastname.required">
                            Last Name is required.
                          </p>
                          <p v-else>Please enter alphabets only.</p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                    <!-- Email -->
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="email"
                          >Email</label
                        >
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="email"
                          name="email"
                          disabled
                          v-model="form.email"
                          aria-describedby="input-4-live-feedback"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                    <!-- Phone -->
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="phone"
                          >Phone</label
                        ><span
                          :class="isEdit.class"
                          @click="isEdit.phone = !isEdit.phone"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="number"
                          id="phone"
                          name="phone"
                          :disabled="isEdit.phone"
                          v-model="$v.form.phone.$model"
                          :state="validateState('phone')"
                          aria-describedby="input-5-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-5-live-feedback">
                          <p v-if="!$v.form.phone.required">
                            Phone is required.
                          </p>
                          <p v-if="!$v.form.phone.minLength">
                            Atleast 4 Digits.
                          </p>
                          <p v-if="!$v.form.phone.maxLength">Max 12 Digits.</p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                    <!-- Address -->
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="address"
                          >Address</label
                        ><span
                          :class="isEdit.class"
                          @click="isEdit.address = !isEdit.address"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="address"
                          name="address"
                          :disabled="isEdit.address"
                          v-model="$v.form.address.$model"
                          :state="validateState('address')"
                          aria-describedby="input-6-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-6-live-feedback">
                          <p v-if="!$v.form.address.required">
                            Address is required.
                          </p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                  </div>
                  <!-- Update Button -->
                  <button
                    type="submit"
                    class="btn btn-info"
                    style="
                      position: absolute;
                      bottom: 20px;
                      right: 20px;
                      width: 180px;
                    "
                  >
                    Update Profile
                  </button>
                </b-form>
              </div>
            </div>
          </b-tab>
          <!-- Work Information -->
          <b-tab title="Work Information">
            <div
              class="card border-0"
              style="min-height: 560px; max-height: 560px"
            >
              <div class="card-body" style="position: relative">
                <h4 style="font-weight: 600">Work Information</h4>
                <p class="text-muted">Update Your Work Information</p>

                <b-form class="form" @submit.stop.prevent="updateProfileData">
                  <div class="row" style="margin-top: 3rem !important">
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="job_title"
                          >Job Title</label
                        ><span
                          :class="isEdit.class"
                          @click="isEdit.jobtitle = !isEdit.jobtitle"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="job_title"
                          name="job_title"
                          :disabled="isEdit.jobtitle"
                          v-model="$v.form.job_title.$model"
                          :state="validateState('job_title')"
                          aria-describedby="input-7-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-7-live-feedback">
                          <p v-if="!$v.form.job_title.required">
                            Job Title is required.
                          </p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="department"
                          >Department</label
                        ><span
                          :class="isEdit.class"
                          @click="isEdit.department = !isEdit.department"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="department"
                          name="department"
                          :disabled="isEdit.department"
                          v-model="$v.form.department.$model"
                          :state="validateState('department')"
                          aria-describedby="input-8-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-8-live-feedback">
                          <p v-if="!$v.form.department.required">
                            Department is required.
                          </p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="location"
                          >Location</label
                        ><span
                          :class="isEdit.class"
                          @click="isEdit.location = !isEdit.location"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="location"
                          name="location"
                          :disabled="isEdit.location"
                          v-model="$v.form.location.$model"
                          :state="validateState('location')"
                          aria-describedby="input-9-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-9-live-feedback">
                          <p v-if="!$v.form.location.required">
                            Location is required.
                          </p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                    <div class="col-md-4">
                      <b-form-group>
                        <label
                          class="text-dark font-weight-bold ml-1"
                          label-for="company"
                          >Company</label
                        ><span
                          :class="isEdit.class"
                          @click="isEdit.company = !isEdit.company"
                        ></span>
                        <b-form-input
                          class="form-control h-auto py-3 px-3"
                          type="text"
                          id="company"
                          name="company"
                          :disabled="isEdit.company"
                          v-model="$v.form.company.$model"
                          :state="validateState('company')"
                          aria-describedby="input-10-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-10-live-feedback">
                          <p v-if="!$v.form.company.required">
                            Company is required.
                          </p>
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-info"
                    style="
                      position: absolute;
                      bottom: 20px;
                      right: 20px;
                      width: 180px;
                    "
                  >
                    Update Profile
                  </button>
                </b-form>
              </div>
            </div>
          </b-tab>
          <!-- Referral History -->
          <b-tab title="Referral History">
            <div
              class="card border-0"
              style="min-height: 560px; max-height: 560px"
            >
              <div class="card-body" style="position: relative">
                <h4 style="font-weight: 600">Referral Code</h4>
                <div class="mt-3">
                  <b-table
                    :items="tableData"
                    :fields="fields"
                    head-variant="light dark"
                    show-empty
                    borderless
                  >
                    <template v-slot:cell(used_code)="row">
                      <b v-if="row.item.used_code">
                        {{ row.item.used_code }}
                      </b>
                      <p v-else>No Referral Code</p>
                    </template>
                  </b-table>
                  <div
                    class="d-flex justify-content-between"
                    v-if="tableData.length > 0"
                  >
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
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../../src/core/services/api.service";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  alpha
} from "vuelidate/lib/validators";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
export default {
  name: "userprofile",
  mixins: [validationMixin],
  components: {
    Cropper
  },
  data() {
    return {
      message: "",
      isEdit: {
        class: "fa fa-pen editIcon",
        firstname: true,
        middlename: true,
        lastname: true,
        phone: true,
        address: true,
        jobtitle: true,
        department: true,
        location: true,
        company: true
      },
      profileData: {},
      total_records: "",
      current_page: 1,
      per_page: { val: 25, label: "25" },
      cropped_picture: null,
      form: {
        profile_picture: null,
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        job_title: "",
        department: "",
        location: "",
        company: ""
      },
      fields: [
        {
          key: "used_code",
          label: "REFERRAL CODE",
          thStyle: { minWidth: "100px" }
        },
        {
          key: "created_at",
          label: "DATE ADDED",
          thStyle: { minWidth: "100px" }
        }
      ],
      tableData: [],
      temp1: null,
      temp2: null
    };
  },
  validations: {
    form: {
      firstname: {
        required,
        alpha
      },
      middlename: {
        alpha
      },
      lastname: {
        required,
        alpha
      },
      phone: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(12),
        minValue: 0
      },
      address: {
        required
      },
      job_title: {
        required
      },
      department: {
        required
      },
      location: {
        required
      },
      company: {
        required
      }
    }
  },
  computed: {
    profileImage: function() {
      let image = this.cropped_picture
        ? this.cropped_picture_src
        : "media/images/profile_icons/upload_picture.png";
      return image;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Profile" }]);
    this.getData();
    this.getReferralHistory();
  },
  methods: {
    closeModal() {
      this.$refs["profilepicturemodal"].hide();
    },
    change({ coordinates, canvas }) {
      this.temp1 = coordinates;
      this.temp2 = canvas;
    },
    handlePagination(value) {
      this.current_page = value;
      this.getData();
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    getData() {
      this.isLoading = true;
      ApiService.get(`me`).then(res => {
        if (res.status == 200) {
          this.profileData = res.data.data;
          this.form.job_title = res.data.data.job_title;
          this.form.department = res.data.data.department;
          this.form.location = res.data.data.location;
          this.form.company = res.data.data.company;
          this.form.firstname = res.data.data.firstname;
          this.form.middlename = res.data.data.middlename;
          this.form.lastname = res.data.data.lastname;
          this.form.email = res.data.data.email;
          this.form.phone = res.data.data.phone;
          this.form.address = res.data.data.address;
          this.isLoading = false;
        }
      });
    },
    getReferralHistory() {
      ApiService.get(`user/1/refCodeHistory`).then(response => {
        if (response.status == 200) {
          this.tableData = response.data.data.data;
          this.total_records = response.data.data.total;
        }
      });
    },
    dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);
      // separate out the mime component
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
    updateProfileData() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.isLoading = true;
      let form_data = new FormData();
      form_data.append("firstname", this.form.firstname);
      form_data.append("middlename", this.form.middlename);
      form_data.append("lastname", this.form.lastname);
      form_data.append("phone", this.form.phone);
      form_data.append("address", this.form.address);
      form_data.append("job_title", this.form.job_title);
      form_data.append("department", this.form.department);
      form_data.append("location", this.form.location);
      form_data.append("company", this.form.company);
      // if (this.form.profile_picture) {
      //   form_data.append("image", this.form.profile_picture);
      // }
      if (this.cropped_picture) {
        const { canvas } = this.$refs.cropper.getResult();
        let blob = canvas.toDataURL();
        var file = this.dataURItoBlob(blob);
        form_data.append("image", file);

        // canvas.toBlob((blob) => {
        //   form_data.append("image", blob);
        // }, "image/jpeg");
      }
      ApiService.post(`update/` + this.profileData.id, form_data).then(res => {
        if (res.data.status == "Success") {
          this.closeModal();
          this.showMsg("success", res.data.message);
          this.isLoading = false;
        }
      });
    },
    showMsg(type, msg) {
      this.$swal
        .fire({
          icon: type,
          title: `${msg}`,
          allowOutsideClick: false,
          allowEscapeKey: false
        })
        .then(result => {
          if (type == "success") {
            if (result.isConfirmed) {
              this.getData();
            }
          }
        });
    },
    onFileChanged(event) {
      this.form.profile_picture = event.target.files[0];
      this.cropped_picture = event.target.files[0];
      this.getFileSrc();
    },
    getFileSrc() {
      if (this.cropped_picture == null) {
        return;
      }
      var input = document.getElementById("file-upload");
      var [file] = input.files;
      let src = URL.createObjectURL(file);
      this.cropped_picture_src = src;
    }
  }
};
</script>
<style scoped>
.cropper {
  height: 200px;
  background: #ddd;
}
.editIcon {
  float: right;
  cursor: pointer;
}
.editIcon:hover {
  color: #6993ff;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
