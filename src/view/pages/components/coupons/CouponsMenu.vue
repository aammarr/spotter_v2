<template>
  <div>
    <router-link to="/addcoupon">
      <div class="list-item hoverable p-2 p-lg-3 mb-2">
        <div class="d-flex align-items-center">
          <div class="symbol symbol-40 symbol-light mr-4">
            <span class="symbol-label bg-hover-white">
              <img
                src="media/images/updated_menu_icons/aside_inner_icons/icon_upload.svg"
                class="h-50 align-self-center"
              />
            </span>
          </div>
          <div class="d-flex flex-column flex-grow-1 mr-2">
            <span class="text-dark-75 font-size-h6 mb-0"> Upload Coupon </span>
          </div>
        </div>
      </div>
    </router-link>
    <router-link to="/searchcoupon">
      <div class="list-item hoverable p-2 p-lg-3 mb-2">
        <div class="d-flex align-items-center">
          <div class="symbol symbol-40 symbol-light mr-4">
            <span class="symbol-label bg-hover-white">
              <img
                src="media/images/updated_menu_icons/aside_inner_icons/icon_search.svg"
                class="h-50 align-self-center"
              />
            </span>
          </div>
          <div class="d-flex flex-column flex-grow-1 mr-2">
            <span class="text-dark-75 font-size-h6 mb-0"> Search Coupon </span>
          </div>
        </div>
      </div>
    </router-link>
    <router-link to="/keyword">
      <div class="list-item hoverable p-2 p-lg-3 mb-2">
        <div class="d-flex align-items-center">
          <div class="symbol symbol-40 symbol-light mr-4">
            <span class="symbol-label bg-hover-white">
              <img
                src="media/images/updated_menu_icons/aside_inner_icons/icon_keywords_new.svg"
                class="h-50 align-self-center"
              />
            </span>
          </div>
          <div class="d-flex flex-column flex-grow-1 mr-2">
            <span class="text-dark-75 font-size-h6 mb-0"> Keyword </span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "couponsmenu",
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    }
  }
};
</script>
