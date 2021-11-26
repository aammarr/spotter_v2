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
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <b-form-group>
          <label class="text-dar font-weight-bold ml-1" label-for="password"
            >Enter New Password</label
          >
          <b-form-input
            class="form-control form-control-solid h-auto py-3 px-3"
            type="password"
            id="password"
            name="password"
            v-model="$v.form.password.$model"
            :state="validateState('password')"
            aria-describedby="input-0-live-feedback"
          ></b-form-input>
          <small class="m-2"
            >Must be at least 8 characters and contain a lowercase letter,
            uppercase letter, number and any special character</small
          >
          <b-form-invalid-feedback id="input-0-live-feedback">
            <p v-if="!$v.form.password.required">Password is required.</p>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group>
          <label class="text-dar font-weight-bold ml-1" label-for="re_password"
            >Re-enter Password</label
          >
          <b-form-input
            class="form-control form-control-solid h-auto py-3 px-3"
            type="password"
            id="re_password"
            name="re_password"
            v-model="$v.form.re_password.$model"
            :state="validateState('re_password')"
            aria-describedby="input-1-live-feedback"
          ></b-form-input>
          <small class="m-2"
            >Must be at least 8 characters and contain a lowercase letter,
            uppercase letter, number and any special character</small
          >

          <b-form-invalid-feedback id="input-1-live-feedback">
            <p v-if="!$v.form.re_password.required">Password is required.</p>
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
        <div class="form-group">
          <button
            type="submit"
            ref="kt_login_signup_submit"
            class="btn btn-info float-right"
          >
            Submit!
          </button>
        </div>
      </b-form>
    </div>
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import ApiService from "../../../core/services/api.service";
export default {
  name: "newpassword",
  mixins: [validationMixin],
  data() {
    return {
      msg: "",
      response: "",
      form: {
        password: "AA!!11aa",
        re_password: "AA!!11aa"
      }
    };
  },
  validations: {
    form: {
      password: {
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
        sameAsPassword: sameAs("password")
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
      let dataToPost = this.form;
      dataToPost.token = this.$route.query.token;

      ApiService.post("/changepassword", dataToPost)
        .then(res => {
          this.response = res;
          submitButton.classList.remove(
            "spinner",
            "spinner-light",
            "spinner-right"
          );
        })
        .catch(err => {
          this.msg = err;
          submitButton.classList.remove(
            "spinner",
            "spinner-light",
            "spinner-right"
          );
        });
    }
  }
};
</script>
