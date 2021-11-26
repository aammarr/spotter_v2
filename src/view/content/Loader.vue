<template>
  <!-- begin::Page loader -->
  <div class="page-loader page-loader-logo" style="position:relative">
    <img
      alt="Logo"
      src="media/images/spotter_logos/spotter_logo_white.jpg"
      width="100%"
      height="100%"
    />
    <div
      class="spinner"
      v-bind:class="spinnerClass || 'spinner-primary'"
      style="position:absolute;top:30%;left:50%"
    ></div>
  </div>
  <!-- end::Page Loader -->
</template>

<script>
export default {
  name: "Loader",
  props: {
    logo: String,
    spinnerClass: String
  }
};
</script>
