<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showLauncher="true"
      :showEmoji="true"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
    >
      <template v-slot:header>
        <div class="d-flex justify-content-start align-items-center">
          <img src="media/images/spotter_logos/favicon_spotter.svg" />
          <h4 class="m-3">{{ participants[0].name }}</h4>
        </div>
      </template>
    </beautiful-chat>
  </div>
</template>
<script>
import ApiService from "../../core/services/api.service";
import { mapGetters } from "vuex";

export default {
  name: "chatbubble",
  data() {
    return {
      participants: [
        {
          id: "user1",
          name: "Spotter",
          imageUrl: "media/images/updated_menu_icons/icon_authors.svg"
        }
      ],

      messageList: [
        {
          type: "text",
          author: `user1`,
          data: {
            text: `Hello User, How may I help you today? Please provide your feedback in details. You may attach images.`
          }
        }
      ],
      isChatOpen: false,
      showTypingIndicator: "",
      colors: {
        header: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        launcher: {
          bg: "#4e8cff"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      },
      alwaysScrollToBottom: false
    };
  },
  computed: {
    ...mapGetters(["appUserGetter"])
  },
  methods: {
    onMessageWasSent(message) {
      this.messageList = [...this.messageList, message];
      let form_data = new FormData();
      form_data.append("userid", this.appUserGetter.data.id);
      form_data.append("message", message.data.text);
      form_data.append("url", this.$route.fullPath);
      if (message.data.file) {
        form_data.append("screenshot", message.data.file);
      } else {
        form_data.append("screenshot", "");
      }
      ApiService.post(`/chatbubble`, form_data).then(res => {
        if (res.data.status == "Success") {
          this.messageList.push({
            type: "text",
            author: `user1`,
            data: {
              // text: `${
              //   this.appUserGetter.data.name.split(" ")[0]
              // },Thanks for your feedback. Admin will get back to you soon`
              text: `Thanks for your feedback, we will get back to you shortly.`
            }
          });
        }
      });
    },
    openChat() {
      this.isChatOpen = true;
    },
    closeChat() {
      this.isChatOpen = false;
    }
  }
};
</script>
