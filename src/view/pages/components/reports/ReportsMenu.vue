<template>
  <div>
    <router-link to="/pdfreport">
      <div class="list-item hoverable p-2 p-lg-3 mb-2">
        <div class="d-flex align-items-center">
          <div class="symbol symbol-40 symbol-light mr-4">
            <span class="symbol-label bg-hover-white">
              <img
                src="media/images/updated_menu_icons/aside_inner_icons/icon_report.svg"
                class="h-50 align-self-center"
              />
            </span>
          </div>
          <div class="d-flex flex-column flex-grow-1 mr-2">
            <span class="text-dark-75 font-size-h6 mb-0">
              Report
            </span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "reportsmenu",
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    }
  }
};
</script>
