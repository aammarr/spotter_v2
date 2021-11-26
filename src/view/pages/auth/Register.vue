<template>
  <div>
    <div class="login-form login-signin">
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
      <div style="height: 50px">
        <div class="p-0 alert bg-light-danger text-center" v-if="errorEnable">
          <p class="m-3 text-danger">{{ errorMsg }}</p>
        </div>
        <div class="p-0 alert bg-light-info text-center" v-if="successEnable">
          <p class="m-3 text-info">{{ successMsg }}</p>
        </div>
      </div>
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <b-form-group>
          <label class="text-dar font-weight-bold ml-1" label-for="firstname"
            >First Name</label
          >
          <b-form-input
            class="form-control form-control-solid h-auto py-3 px-3"
            id="firstname"
            name="firstname"
            v-model="$v.form.firstname.$model"
            :state="validateState('firstname')"
            aria-describedby="input-0-live-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="input-0-live-feedback">
            <p v-if="!$v.form.firstname.required">First Name is required.</p>
            <p v-else>Please enter alphabets only.</p>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group>
          <label class="text-dar font-weight-bold ml-1" label-for="lastname"
            >Last Name</label
          >
          <b-form-input
            class="form-control form-control-solid h-auto py-3 px-3"
            id="lastname"
            name="lastname"
            v-model="$v.form.lastname.$model"
            :state="validateState('lastname')"
            aria-describedby="input-1-live-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="input-2-live-feedback">
            <p v-if="!$v.form.lastname.required">Last Name is required.</p>
            <p v-else>Please enter alphabets only.</p>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group>
          <label class="text-dar font-weight-bold ml-1" label-for="email"
            >Email</label
          >
          <b-form-input
            class="form-control form-control-solid h-auto py-3 px-3"
            id="email"
            name="email"
            v-model.trim="$v.form.email.$model"
            :state="validateState('email')"
            aria-describedby="input-2-live-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="input-2-live-feedback">
            <p v-if="!$v.form.email.required">Email is required.</p>
            <p v-if="!$v.form.email.email">Please Enter a Valid Email.</p>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group>
          <label class="text-dar font-weight-bold ml-1" label-for="password"
            >Password</label
          >
          <b-form-input
            class="form-control form-control-solid h-auto py-3 px-3"
            type="password"
            id="password"
            name="password"
            v-model="$v.form.password.$model"
            :state="validateState('password')"
            aria-describedby="input-3-live-feedback"
          ></b-form-input>
          <small class="m-2"
            >Must be at least 8 characters and contain a lowercase letter,
            uppercase letter, number and any special character</small
          >
          <b-form-invalid-feedback id="input-3-live-feedback">
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
            aria-describedby="input-4-live-feedback"
          ></b-form-input>
          <small class="m-2"
            >Must be at least 8 characters and contain a lowercase letter,
            uppercase letter, number and any special character</small
          >

          <b-form-invalid-feedback id="input-4-live-feedback">
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

        <b-form-group>
          <label
            class="text-dar font-weight-bold ml-1"
            label-for="referral_code"
            >Referral Code</label
          >
          <b-form-input
            class="form-control form-control-solid h-auto py-3 px-3"
            type="text"
            id="referral_code"
            name="referral_code"
            v-model="$v.form.referral_code.$model"
            :state="validateState('referral_code')"
            aria-describedby="input-5-live-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="input-5-live-feedback">
            <p v-if="!$v.form.referral_code.required">
              Referral Code is required.
            </p>
            <p
              v-if="
                !$v.form.referral_code.numeric && $v.form.referral_code.required
              "
            >
              Must be numeric value.
            </p>
          </b-form-invalid-feedback>
        </b-form-group>

        <div class="form-group">
          <button
            type="submit"
            ref="kt_login_signup_submit"
            class="btn btn-info float-right"
          >
            Sign Up
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
import { mapState } from "vuex";
import { validationMixin } from "vuelidate";
import {
  email,
  required,
  minLength,
  sameAs,
  numeric,
  alpha
} from "vuelidate/lib/validators";
import ApiService from "../../../core/services/api.service";

export default {
  mixins: [validationMixin],
  name: "register",
  data() {
    return {
      errorEnable: false,
      errorMsg: "",
      successMsg: "",
      successEnable: false,
      form: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        re_password: "",
        referral_code: ""
      }
    };
  },
  validations: {
    form: {
      firstname: {
        required,
        alpha
      },
      lastname: {
        required,
        alpha
      },
      email: {
        required,
        email
      },
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
      },
      referral_code: {
        required,
        numeric,
        minLength: minLength(4)
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
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        re_password: null,
        referral_code: null
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
      let firstname = this.$v.form.firstname.$model;
      let lastname = this.$v.form.lastname.$model;
      let email = this.$v.form.email.$model;
      let password = this.$v.form.password.$model;
      let referral_code = this.$v.form.referral_code.$model;
      let submitButton = this.$refs["kt_login_signup_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");
      let dataToPost = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        referral_code: referral_code
      };
      ApiService.post(`/signup`, dataToPost)
        .then(res => {
          if (res.data.success == false) {
            submitButton.classList.remove(
              "spinner",
              "spinner-light",
              "spinner-right"
            );
            this.errorMsg = res.data.message;
            this.errorEnable = true;
            setTimeout(() => {
              this.errorMsg = "";
              this.errorEnable = false;
            }, 5000);
          } else {
            // if (res.data.success == "ok") {
            submitButton.classList.remove(
              "spinner",
              "spinner-light",
              "spinner-right"
            );
            this.successMsg = res.data.message;
            this.successEnable = true;
            this.resetForm();
            setTimeout(() => {
              this.successMsg = "";
              this.successEnable = false;
              this.$router.push({ name: "login" });
            }, 5000);
          }
        })
        .catch(err => {
          let temp = err;
          this.temp = temp + " test";
        });
      // dummy delay
      // setTimeout(() => {
      //   this.$store
      //     .dispatch(REGISTER, {
      //       email: email,
      //       password: password,
      //       referal_code: referal_code,
      //     })
      //     .then(() => this.$router.push({ name: "dashboard" }));

      //   submitButton.classList.remove(
      //     "spinner",
      //     "spinner-light",
      //     "spinner-right"
      //   );
      // }, 2000);
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
