<template>
  <!-- begin::Scrolltop -->
  <div id="scrollFromTop" ref="scrollFromTop" class="scrolltop">
    <span class="svg-icon">
      <inline-svg src="media/svg/icons/Navigation/Up-2.svg" />
    </span>
  </div>
  <!-- end::Scrolltop -->
</template>

<script>
import ScrollFromTop from "@/assets/js/layout/extended/scrolltop.js";

export default {
  name: "KTScrollTop",
  mounted() {
    ScrollFromTop.init(this.$refs["scrollFromTop"]);
  }
};
</script>
