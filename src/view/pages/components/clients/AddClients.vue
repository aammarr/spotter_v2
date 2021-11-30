<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <b-card>
      <h3 class="card-title" style="font-weight: 600">Add New Client</h3>
      <hr />
      <b-form class="mt-10">
        <!-- Display Name -->
        <b-form-group>
          <h5 class="mt-2 text-dark" style="font-weight: 600">
            Client Display Name
          </h5>
          <b-form-input
            id="name"
            name="name"
            v-model="$v.form.name.$model"
            :state="validateState('name')"
            class="mb-2 font_size"
            placeholder="Enter the display name for the client"
          ></b-form-input>
        </b-form-group>
        <!-- English Client Name -->
        <b-form-group>
          <div class="d-flex justify-content-start">
            <h5 class="mt-2 text-dark" style="font-weight: 600">
              Name Variations In English
            </h5>
            <b-icon
              class="m-3"
              icon="question-circle-fill"
              scale="1"
              v-b-tooltip.focus="
                'You can enter different variations of the client name. For example, for client Sample Brand, possible variations could be: Sample Brand, samplebrand, Sample_brand, sample&brand etc. Multiple values can be entered.'
              "
              variant="info"
            ></b-icon>
          </div>
          <multiselect
            id="english_name"
            v-model="form.english_name"
            class="mb-2 multiselectcustomclass"
            tag-placeholder="Add this as new tag"
            placeholder="Enter name variations in English"
            label="name"
            track-by="unique_code"
            :options="form.english_name"
            :multiple="true"
            :taggable="true"
            @tag="addEnglishName"
          ></multiselect>
        </b-form-group>
        <!-- Arabic Client Name -->
        <b-form-group>
          <div class="d-flex justify-content-start">
            <h5 class="mt-2 text-dark" style="font-weight: 600">
              Name Variations In Arabic
            </h5>
            <b-icon
              class="m-3"
              icon="question-circle-fill"
              v-b-tooltip.focus="
                'يمكنك إدخال أشكال مختلفة من اسم العميل. على سبيل المثال ، بالنسبة إلى نموذج العلامة التجارية للعميل ، يمكن أن تكون الاختلافات المحتملة: نموذج العلامة التجارية ، وعينة العلامة التجارية ، وعينة العلامة التجارية ، والعينة والعلامة التجارية وما إلى ذلك.'
              "
              scale="1"
              variant="info"
            ></b-icon>
          </div>
          <multiselect
            id="arabic_name"
            v-model="form.arabic_name"
            class="mb-2 multiselectcustomclass"
            tag-placeholder="Add this as new tag"
            placeholder="Enter name variations in Arabic"
            label="name"
            track-by="unique_code"
            :options="form.arabic_name"
            :multiple="true"
            :taggable="true"
            @tag="addArabicName"
          ></multiselect>
        </b-form-group>
        <!-- File -->
        <h5 class="mt-2 text-dark" style="font-weight: 600">Choose File</h5>

        <div class="form-control">
          <label for="file-upload" class="custom-file-upload">
            <img
              src="media/images/other_icons/icon_upload.svg"
              style="height: 25px; width: 20px"
            />
          </label>
          <input
            type="file"
            id="file-upload"
            @change="onFileChanged"
            accept="image/jpeg, image/png"
          />
          <small v-if="!filelist.length" class="ml-8 font-size-lg text-muted">
            {{ form.image == "" ? "No choosen File" : getFileName() }}
          </small>
          <small v-if="filelist.length" class="ml-8 font-size-lg text-muted">
            {{ filelist[0].name }}
          </small>
          <b-icon
            v-if="form.image !== '' || filelist.length"
            class="float-right"
            icon="x-circle"
            scale="1.5"
            style="cursor: pointer"
            @click="filelist.length ? (filelist = []) : (form.image = '')"
            variant="danger"
          ></b-icon>
        </div>
        <!-- <small
          class="text-muted font-weight-light font-size-lg"
          style="position: relative; left: -32px; top: 8px"
          >Upload or drag image of brand logo</small
        > -->
      </b-form>
      <!-- drag and drop -->
      <div class="text-center mt-2">
        <div
          class="p-2 border-light border border-gray-300"
          @dragover="dragover"
          @dragleave="dragleave"
          @drop="drop"
        >
          <input
            type="file"
            name="fields[assetsFieldHandle][]"
            id="assetsFieldHandle"
            class="w-px h-px opacity-0 overflow-hidden absolute"
            @change="onChange"
            ref="file"
            accept=".jpg,.jpeg,.png"
          />

          <label for="assetsFieldHandle" class="block cursor-pointer">
            <div>
              <small
                class="text-muted font-weight-light font-size-lg"
                style="position: relative; left: -32px; top: 8px"
                >Upload or drag image of brand logo</small
              >
            </div>
          </label>
        </div>
      </div>
      <p style="color: #cfcfcf">
        Accepted formats are jpg, jpeg and png. Maximum Size: 5MBs.
      </p>

      <hr style="margin-top: 5%" />
      <b-button
        type="button"
        variant="info"
        class="float-right"
        @click="onSubmit"
        >Submit</b-button
      >
    </b-card>
    <div style="height: 200px; visibility: hidden"></div>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";
import Loading from "vue-loading-overlay";
import { validationMixin } from "vuelidate";
import { required, alphaNum } from "vuelidate/lib/validators";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  name: "addclient",
  mixins: [validationMixin],
  components: { Loading },
  delimiters: ["${", "}"], // Avoid Twig
  data() {
    return {
      isLoading: false,
      headVariant: "light",
      arabicNameOptions: [],
      englishNameOptions: [],
      form: {
        name: "",
        arabic_name: [],
        english_name: [],
        image: ""
      },
      fields: ["id", "coupon_name", "created_at"],
      filelist: []
    };
  },
  validations: {
    form: {
      name: {
        required,
        alphaNum
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Clients" }]);
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    // drag and drop
    onChange() {
      this.filelist = [...this.$refs.file.files];
    },
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains("border-success")) {
        event.currentTarget.classList.remove("border-light");
        event.currentTarget.classList.add("border-success");
      }
    },
    dragleave(event) {
      // Clean up
      event.currentTarget.classList.add("border-light");
      event.currentTarget.classList.remove("border-success");
    },

    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange(); // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add("border-light");
      event.currentTarget.classList.remove("border-success");
    },

    checkValidateForm() {
      if (this.form.name == "") {
        this.showMsg("error", "Please Enter Name");
        return false;
      }
      if (this.form.arabic_name.length == 0) {
        this.showMsg("error", "Please Enter atleast 1 arabic Name");
        return false;
      }
      if (this.form.english_name.length == 0) {
        this.showMsg("error", "Please Enter atleast 1 english Name");
        return false;
      }
      if (this.form.image == "" && !this.filelist.length) {
        this.showMsg("error", "Please Enter File");
        return false;
      }
      return true;
    },
    addEnglishName(newTag) {
      let tag = {
        name: newTag,
        unique_code:
          newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.englishNameOptions.push(tag);
      this.form.english_name.push(tag);
    },
    addArabicName(newTag) {
      let tag = {
        name: newTag,
        unique_code:
          newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.arabicNameOptions.push(tag);
      this.form.arabic_name.push(tag);
    },
    async onSubmit() {
      if (this.checkValidateForm()) {
        this.isLoading = true;
        let form_data = new FormData();
        let arabic_name = [];
        let english_name = [];
        this.form.arabic_name.forEach(val => {
          arabic_name.push(val.name);
        });
        this.form.english_name.forEach(val => {
          english_name.push(val.name);
        });
        form_data.append("name", this.form.name);
        form_data.append("arabic_name", arabic_name);
        form_data.append("english_name", english_name);
        if (this.form.image) {
          form_data.append("image", this.form.image);
        }
        if (this.filelist.length) {
          form_data.append("image", this.filelist[0]);
        }
        await ApiService.post(`/clients/add`, form_data)
          .then(response => {
            this.isLoading = false;
            if (response.data.success == "ok") {
              this.showMsg("success", response.data.message);
            }
          })
          .catch(err => {
            this.isLoading = false;
            this.showMsg("error", err.response.data.name);
          });
      }
    },
    showMsg(type, msg) {
      this.$swal
        .fire({
          icon: type,
          text: msg
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
      this.form.name = "";
      this.form.english_name = [];
      this.form.arabic_name = [];
      this.form.image = "";
      this.filelist = [];
    },
    onFileChanged(event) {
      this.form.image = event.target.files[0];
    },
    getFileName() {
      var name = document.getElementById("file-upload");
      let file_name = name.files.item(0).name;
      let file_size = name.files.item(0).size;
      let file_type = name.files.item(0).type;
      return `${file_name} - ${file_size} - ${file_type}`;
    }
  }
};
</script>
<style scoped>
.multiselectcustomclass {
  font-size: 12px !important;
}
.font_size {
  font-size: 14px;
  font-weight: 400;
}
[v-cloak] {
  display: none;
}
</style>
