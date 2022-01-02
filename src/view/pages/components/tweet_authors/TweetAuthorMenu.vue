<template>
  <div>
    <router-link to="/add-username">
      <div class="list-item hoverable p-2 p-lg-3 mb-2">
        <div class="d-flex align-items-center">
          <div class="symbol symbol-40 symbol-light mr-4">
            <span class="symbol-label bg-hover-white">
              <img
                src="media/images/updated_menu_icons/aside_inner_icons/icon_add.svg"
                class="h-50 align-self-center"
              />
            </span>
          </div>
          <div class="d-flex flex-column flex-grow-1 mr-2">
            <span class="text-dark-75 font-size-h6 mb-0">
              Add Whitelisted User
            </span>
          </div>
        </div>
      </div>
    </router-link>
    <router-link to="/delete-username">
      <div class="list-item hoverable p-2 p-lg-3 mb-2">
        <div class="d-flex align-items-center">
          <div class="symbol symbol-40 symbol-light mr-4">
            <span class="symbol-label bg-hover-white">
              <img
                src="media/images/updated_menu_icons/aside_inner_icons/icon_delete.svg"
                class="h-50 align-self-center"
              />
            </span>
          </div>
          <div class="d-flex flex-column flex-grow-1 mr-2">
            <span class="text-dark-75 font-size-h6 mb-0">
              Delete Whitelisted User
            </span>
          </div>
        </div>
      </div>
    </router-link>
    <router-link to="/all-frequentspammers">
      <div class="list-item hoverable p-2 p-lg-3 mb-2">
        <div class="d-flex align-items-center">
          <div class="symbol symbol-40 symbol-light mr-4">
            <span class="symbol-label bg-hover-white">
              <img
                src="media/images/updated_menu_icons/aside_inner_icons/icon_spam.svg"
                class="h-50 align-self-center"
              />
            </span>
          </div>
          <div class="d-flex flex-column flex-grow-1 mr-2">
            <span class="text-dark-75 font-size-h6 mb-0">
              Frequent Spammers
            </span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "tweetauthormenu",
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    }
  }
};
</script>
