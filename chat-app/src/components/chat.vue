<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showEdition="true"
      :showDeletion="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
    />
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "Chat",
  data() {
    return {
      socket: {},
      participants: [
        {
          id: "admin",
          name: "Chăm sóc khách hàng",
          imageUrl:
            "https://banner2.cleanpng.com/20180809/kwi/kisspng-help-desk-technical-support-outsourcing-computer-i-data-recovery-in-ahmedabad-best-data-recovery-in-i-5b6ca9bd39cd44.1795230815338479972368.jpg",
        },
      ],
      messageList: [
      ],
      newMessagesCount: 0,
      isChatOpen: true,
      showTypingIndicator: "",
      colors: {
        header: {
          bg: "#4e8cff",
          text: "#ffffff",
        },
        launcher: {
          bg: "#4e8cff",
        },
        messageList: {
          bg: "#ffffff",
        },
        sentMessage: {
          bg: "#4e8cff",
          text: "#ffffff",
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222",
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867",
        },
      },
      alwaysScrollToBottom: false,
      messageStyling: true,
    };
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: "support",
          type: "text",
          data: { text },
        });
      }
    },
    onMessageWasSent(message) {
      // called when the user sends a message
      console.log(message.data);
      this.socket.emit("send-client", { message: message.data });
      this.messageList = [...this.messageList, message];
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      // console.log("Emit typing event");
    },
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
  },
  created() {
    this.socket = io("http://localhost:3500");
    this.socket.on("send-user", (res) => {
      const message = { author: "admin", type: "text", data: res };
      this.messageList = [...this.messageList, message];
    });
  },
};
</script>

<style></style>
