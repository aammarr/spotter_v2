<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row">
      <div class="col-md-12">
        <div class="card" style="min-height: 270px">
          <div class="card-body" style="position: relative">
            <h4 style="font-weight: 600">Privacy Settings</h4>
            <p class="text-muted">Update Your Password</p>
            <b-form class="form" @submit.stop.prevent="updatePassword">
              <div class="row" style="margin-top: 3rem !important">
                <div class="col-md-4">
                  <b-form-group>
                    <label
                      class="text-dar font-weight-bold ml-1"
                      label-for="existing_password"
                      >Existing Password</label
                    >
                    <b-form-input
                      class="form-control h-auto py-3 px-3"
                      type="password"
                      id="existing_password"
                      name="existing_password"
                      v-model="$v.form.existing_password.$model"
                      :state="validateState('existing_password')"
                      aria-describedby="input-1-live-feedback"
                    ></b-form-input>
                    <b-form-invalid-feedback id="input-1-live-feedback">
                      <p v-if="!$v.form.existing_password.required">
                        Password is required.
                      </p>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group>
                    <label
                      class="text-dar font-weight-bold ml-1"
                      label-for="new_password"
                      >New Password</label
                    >
                    <b-form-input
                      class="form-control h-auto py-3 px-3"
                      type="password"
                      id="new_password"
                      name="new_password"
                      v-model="$v.form.new_password.$model"
                      :state="validateState('new_password')"
                      aria-describedby="input-2-live-feedback"
                    ></b-form-input>
                    <span class="text-muted w-100 font-size-xs"
                      >Must be at least 8 characters and contain a lowercase
                      letter, uppercase letter, number and any special
                      character</span
                    >
                    <b-form-invalid-feedback id="input-2-live-feedback">
                      <p v-if="!$v.form.new_password.required">
                        Password is required.
                      </p>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group>
                    <label
                      class="text-dar font-weight-bold ml-1"
                      label-for="re_password"
                      >Re-enter Password</label
                    >
                    <b-form-input
                      class="form-control h-auto py-3 px-3"
                      type="password"
                      id="re_password"
                      name="re_password"
                      v-model="$v.form.re_password.$model"
                      :state="validateState('re_password')"
                      aria-describedby="input-3-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-3-live-feedback">
                      <p v-if="!$v.form.re_password.required">
                        Password is required.
                      </p>
                      <p
                        v-if="
                          !$v.form.re_password.sameAsPassword &&
                            $v.form.re_password.required
                        "
                      >
                        Must be same as password.
                      </p>
                    </b-form-invalid-feedback>
                  </b-form-group>
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
                  Save
                </button>
              </div>
            </b-form>
          </div>
        </div>
        <!-- referral code section -->
        <div v-if="applicationUser">
          <div
            class="card mt-3"
            style="min-height: 150px"
            v-if="
              applicationUser.data.role == 'Super Admin' ||
                applicationUser.data.role == 'Admin'
            "
          >
            <div class="card-body" style="position: relative">
              <div>
                <h4 style="font-weight: 600">Referral Code</h4>
                <p class="text-muted">Generate Referral Code</p>
                <div
                  class="row d-flex align-items-center"
                  style="margin-top: 3rem !important"
                >
                  <!--  -->
                  <div class="col-md-4">
                    <multiselect
                      v-model="selectedRole"
                      id="roles"
                      :options="allRoles"
                      class="multiselectcustomclass"
                      selectLabel="select"
                      deselectLabel="remove"
                      :maxHeight="200"
                      placeholder="Roles"
                      label="name"
                      track-by="id"
                    >
                    </multiselect>
                    <span v-if="selectedRoleError" class="text-danger m-2"
                      >Please Select Role</span
                    >
                  </div>
                  <button
                    type="button"
                    class="btn btn-info"
                    @click="generateReferralCode()"
                  >
                    Generate Referral Code
                  </button>
                </div>
                <div class="row m-2">
                  <h1>
                    {{ this.referralCode }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../../src/core/services/api.service";
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "accountsetting",
  mixins: [validationMixin],
  components: { Loading },
  data() {
    return {
      referralCode: null,
      message: null,
      isLoading: false,
      applicationUser: null,
      allRoles: [],
      selectedRole: null,
      selectedRoleError: false,
      form: {
        existing_password: "",
        new_password: "",
        re_password: ""
      }
    };
  },
  created() {
    this.appUserAction;
  },
  computed: {
    ...mapActions(["appUserAction"]),
    ...mapGetters(["appUserGetter"])
  },
  watch: {
    appUserGetter(newValue) {
      if (newValue) {
        this.applicationUser = newValue;
      }
    }
  },
  validations: {
    form: {
      existing_password: {
        required
      },
      new_password: {
        required,
        minLength: minLength(8),
        valid: function(value) {
          const containsUppercase = /[A-Z]/.test(value);
          const containsLowercase = /[a-z]/.test(value);
          const containsNumber = /[0-9]/.test(value);
          const containsSpecial = /[#?!@$%^&*-]/.test(value);
          return (
            containsUppercase &&
            containsLowercase &&
            containsNumber &&
            containsSpecial
          );
        }
      },
      re_password: {
        required,
        sameAsPassword: sameAs("new_password")
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Account Settings" }]);
    this.getAllRoles();
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = { existing_password: "", new_password: "", re_password: "" };
      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    updatePassword() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.isLoading = true;
      let user_id = this.applicationUser.data.id;
      let dataToPost = {
        current_password: this.$v.form.existing_password.$model,
        password: this.$v.form.new_password.$model,
        confirm_password: this.$v.form.re_password.$model
      };
      ApiService.post(`changepassword/` + user_id, dataToPost).then(res => {
        if (res.data.status == "Success") {
          this.showMsg("success", res.data.message);
        } else {
          this.showMsg("error", res.data.message);
        }
        this.isLoading = false;
      });
    },
    showMsg(type, msg) {
      this.$swal
        .fire({
          icon: type,
          title: `${msg}!`,
          text: type == "success" ? "Please Login to Continue" : null,
          allowOutsideClick: false,
          allowEscapeKey: false
        })
        .then(result => {
          if (type == "success") {
            if (result.isConfirmed) {
              this.onLogout();
            }
          } else if (type == "referralsuccess") {
            return;
          }
        });
    },
    onLogout() {
      this.$store
        .dispatch(LOGOUT)
        .then(() => this.$router.push({ name: "login" }));
    },
    getAllRoles() {
      ApiService.get(`getRoles`).then(res => {
        if (res.data.status) {
          this.allRoles = res.data.data;
        }
      });
    },
    generateReferralCode() {
      if (this.selectedRole == null) {
        this.selectedRoleError = true;
        return;
      }
      this.selectedRoleError = false;
      this.isLoading = true;
      let user_id = this.applicationUser.data.id;
      let dataToPost = {
        reffered_user_role: this.selectedRole.name
      };
      ApiService.post(`user/` + user_id + `/generaterefcode`, dataToPost).then(
        res => {
          if (res.status == 200) {
            this.referralCode = res.data.data;
            this.message = res.data.message;
            this.showMsg("referralsuccess", res.data.message);
          } else {
            this.referralCode = null;
            this.message = null;
            this.showMsg("error", res.data.message);
          }
        }
      );
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.multiselectcustomclass {
  font-size: 9px !important;
}
</style>
