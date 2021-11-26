<template>
  <div>
    <div class="login-form login-signin">
      <div class="text-center mb-6 mb-lg-10">
        <div class="text-center mb-6 mb-lg-10">
          <h3 class="font-size-h1">Welcome to Spotter</h3>
          <span class="font-weight-bold font-size-3 text-muted">
            Already have an account?
          </span>
          <router-link
            class="font-weight-bold font-size-3 ml-2 text-info"
            :to="{ name: 'login' }"
          >
            Sign In!
          </router-link>
        </div>
      </div>
      <b-form class="form">
        <div v-if="showMsg.success">
          <div class="alert bg-light-info">
            <div class="text-info text-center">
              {{ msg }}
            </div>
          </div>
        </div>
        <div v-if="showMsg.error">
          <div class="alert bg-light-danger">
            <div class="text-danger text-center">
              {{ showMsg.errMsg }}
            </div>
          </div>
        </div>
        <b-form-group>
          <label class="text-dar font-weight-bold ml-1" label-for="email"
            >Enter Valid Email Address</label
          >
          <b-form-input
            class="form-control form-control-solid h-auto py-3 px-3"
            id="email"
            name="email"
            v-model="$v.form.email.$model"
            :state="validateState('email')"
            aria-describedby="input-0-live-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="input-0-live-feedback">
            Email is required.
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="form-group">
          <button
            type="button"
            ref="kt_login_signup_submit"
            class="btn btn-info float-right"
            @click="onSubmit"
          >
            Submit!
          </button>
        </div>
      </b-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.spinner.spinner-right {
  padding-right: 3.5rem !important;
}
</style>
<script>
import { validationMixin } from "vuelidate";
import { email, required } from "vuelidate/lib/validators";
import ApiService from "../../../core/services/api.service";
export default {
  name: "forgotpassword",
  mixins: [validationMixin],
  data() {
    return {
      form: {
        email: ""
      },
      msg: "",
      showMsg: {
        success: false,
        error: false,
        errMsg: ""
      }
    };
  },
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        email: ""
      };
      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      const submitButton = this.$refs["kt_login_signup_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");
      ApiService.post("/recovery", this.form).then(res => {
        submitButton.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
        if (res.data.status == "failed") {
          this.showMsg.errMsg = res.data.message;
          this.showMsg.error = true;
          return;
        }
        this.showMsg.success = true;
      });
    }
  }
};
</script>
