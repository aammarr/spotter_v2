<template>
  <div>
    <div v-if="content" class="d-flex justify-content-end TopMargin mb-3">
      <b-button variant="info" @click="newUpload">New Upload</b-button>
    </div>
    <!-- Upload Form -->
    <div v-if="!isLoading && !content" class="card">
      <div class="card-header">
        <h4>Upload Image</h4>
      </div>
      <div class="card-body">
        <b-form class="form mt-3" @submit.stop.prevent="recognize">
          <b-form-group>
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon icon="image-fill"></b-icon>
              </b-input-group-prepend>
              <!-- :disabled="busy" -->
              <b-form-file
                id="upload-img"
                ref="images"
                v-model="file"
                :state="required"
                accept="image/*"
                @change="onFileChange"
              ></b-form-file>
            </b-input-group>
            <p
              v-if="required != null && required == false"
              class="text-danger mt-1"
            >
              Image File Required !
            </p>
          </b-form-group>
          <button type="submit" class="btn btn-info btn-sm float-right">
            Analyze Image
          </button>
        </b-form>
      </div>
    </div>
    <!-- Upload Form -->
    <!-- Loading -->
    <div v-if="isLoading" class="card">
      <div class="row">
        <div class="col-md-3">
          <div class="m-3" style="height: 200px">
            <b-skeleton-img no-aspect></b-skeleton-img>
          </div>
        </div>
        <div class="col-md-9">
          <div class="card-body">
            <h4 class="card-title m-1">Analyzing your image result</h4>
            <p class="card-text text-muted">{{ url }}</p>
            <b-progress
              :value="progressValue"
              :max="maxProgress"
              variant="info"
              show-progress
              animated
            ></b-progress>
          </div>
        </div>
      </div>
    </div>
    <!-- Loading -->
    <!-- Result -->
    <div v-show="content" class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <div id="preview">
              <!-- <img v-show="content" id="text-img" :src="url" /> -->
              <img id="text-img" :src="url" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <p id="content">{{ content }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Result -->
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { createWorker, PSM, OEM } from "tesseract.js";
const worker = createWorker();
export default {
  name: "ocr",
  data() {
    return {
      isLoading: false,
      file: null,
      required: null,
      url: "",
      progressValue: 0,
      maxProgress: 100,
      content: ""
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "OCR Analyzer" }]);
  },
  methods: {
    onFileChange(e) {
      this.content = "";
      if (e.target.files[0]) {
        const file = e.target.files[0];
        this.url = URL.createObjectURL(file);
        this.required = true;
      } else {
        this.file = null;
        this.url = "";
        this.required = false;
      }
    },
    async recognize() {
      if (this.file == null) {
        this.required = false;
        return;
      }
      this.isLoading = true;
      this.setProgressBar();
      const img = document.getElementById("text-img");
      await worker.load();
      await worker.loadLanguage("ara");
      await worker.initialize("ara", OEM.LSTM_ONLY);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK
      });
      const {
        data: { text }
      } = await worker.recognize(img);
      this.progressValue = 100;
      this.content = text;
    },
    setProgressBar() {
      let that = this;
      if (this.progressValue >= 100) {
        this.isLoading = false;
        this.progressValue = 0;
      } else {
        setTimeout(() => {
          that.progressValue += 5;
          that.setProgressBar();
        }, 2500);
      }
    },
    newUpload() {
      this.file = null;
      this.required = null;
      this.url = "";
      this.progressValue = 0;
      this.content = "";
    }
  }
};
</script>
<style scoped>
#text-img {
  width: 25rem;
  height: 25rem;
}
</style>
