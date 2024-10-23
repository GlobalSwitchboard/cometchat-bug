<script setup lang="ts">
import {
  ConversationsConfiguration,
  ConversationsStyle,
  MessageComposerConfiguration,
  MessageComposerStyle,
  MessageListConfiguration,
  MessagesConfiguration,
} from "@cometchat/uikit-shared";
import {
  CometChatConversationsWithMessages,
  CometChatUIKit,
  ListItemStyle,
} from "@cometchat/chat-uikit-vue";
// import { useCometChatStore } from "../store/cometChat.store";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { CometChatMessageEvents } from "@cometchat/uikit-resources";
// import { useAuthStore } from "../store/auth.store";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { UIKitSettings } from "../main";
import { useCometChatStore } from "@/stores/cometChat";

// const cometChatStore = useCometChatStore();
// const authStore = useAuthStore();

const windowWidth = ref(window.outerWidth);
const isMobileView = computed(() => windowWidth.value < 800);
const loggedInCometChatUser = ref<CometChat.User | undefined>(undefined);
const cometChatUserUid = ref<string>("");

//creating conversations configuration
const conversationsConfiguration: ConversationsConfiguration =
  new ConversationsConfiguration({
    disableUsersPresence: true,
    disableSoundForMessages: true,
    menu: new Object(),
    options: () => [],
    conversationsStyle: new ConversationsStyle({
      border: "none",
    }),
    listItemStyle: new ListItemStyle({
      padding: "18px",
      hoverBackground: "#F8F8FA",
      activeBackground: "#F8F8FA",
      borderRadius: "12px",
      separatorColor: "transparent",
    }),
  });

const messagesConfiguration: MessagesConfiguration = new MessagesConfiguration({
  hideDetails: true,

  messageListConfiguration: new MessageListConfiguration({
    disableMentions: true,
    disableReactions: true,
    scrollToBottomOnNewMessages: true,
  }),
  messageComposerConfiguration: new MessageComposerConfiguration({
    disableMentions: true,
    messageComposerStyle: new MessageComposerStyle({
      inputBackground: "transparent",
      border: "1px solid var(--default-grey-light)",
      borderRadius: "12px",
      inputBorder: "none",
    }),
  }),
});

onMounted(() => {
  CometChatMessageEvents.ccMessageSent.subscribe((data) => {
    if (data.status == 1)
      console.log("message sent. receiverId: " + data.message.getReceiverId());
  });
  CometChat.addLoginListener(
    "loginListener",
    new CometChat.LoginListener({
      loginSuccess: (user: CometChat.User) => {
        loggedInCometChatUser.value = user;
        console.log("loginSuccess");
      },
    }),
  );
  window.addEventListener(
    "resize",
    () => (windowWidth.value = window.outerWidth),
  );

  // if (authStore.isAdmin)
  //   cometChatStore
  //     .loginAsConcierge()
  //     .then(() => (isConciergeView.value = true));
});

onUnmounted(() => {
  CometChatMessageEvents.ccMessageSent.unsubscribe();
  CometChat.removeLoginListener("loginListener");
  CometChat.logout();
});

// function toggleConciergeView() {
//   isConciergeView.value = !isConciergeView.value;
//   if (isConciergeView.value) {
//     cometChatStore.loginAsConcierge();
//   } else {
//     if (authStore.currentUser) cometChatStore.login();
//   }
// }

function errorCatch() {
  console.log("loggedInCometChatUser is " + loggedInCometChatUser);
  return "helo";
}
</script>

<template>
  <div class="container">
    <p>{{ UIKitSettings }}</p>
    <input v-model="cometChatUserUid" placeholder="CometChat User UID" />
    <button @click="useCometChatStore().login(cometChatUserUid)">Login</button>
    <CometChatConversationsWithMessages
      :key="
        loggedInCometChatUser ? loggedInCometChatUser.getUid() : errorCatch()
      "
      :class="{ noborder: isMobileView }"
      :isMobileView="isMobileView"
      :conversationConfiguration="conversationsConfiguration"
      :messagesConfiguration="messagesConfiguration"
      messageText="No conversations selected"
      title="Inbox"
    />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-flow: column nowrap;
  gap: 16px;
  height: 100%;

  // screen height - header - padding
  max-height: 700px;

  .admin-button {
    display: flex;
    justify-content: end;
  }

  .noborder {
    border: none;
  }
}
</style>
