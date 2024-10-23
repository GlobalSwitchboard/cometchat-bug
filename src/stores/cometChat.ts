import { defineStore } from "pinia";
import { CometChatUIKit } from "@cometchat/chat-uikit-vue";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { UIKitSettings } from "../main";

interface UnreadMessages {
  users: { [uid: string]: number };
  groups: { [guid: string]: number };
}

interface PreloginData {
  user_exists: boolean;
  conversations: number;
  unread_messages: number;
}

export const useCometChatStore = defineStore("cometChat", {
  state: () => ({
    userExists: undefined as boolean | undefined,
    unreadMessages: 0 as UnreadMessages | number,
    conversations: 0 as CometChat.Conversation[] | number,
    preloginReceived: new Promise(() => {
      /* never resolve */
    }) as Promise<any>,
  }),
  getters: {
    totalUnreadMessages(state) {
      if (typeof state.unreadMessages == "number") return state.unreadMessages;

      const unreadUser = Object.values(state.unreadMessages.users).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );
      const unreadGroup = Object.values(state.unreadMessages.groups).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );
      return unreadUser + unreadGroup;
    },
    hasUnreadMessages(): boolean {
      return this.totalUnreadMessages > 0;
    },
    hasConversations(state) {
      if (typeof state.conversations == "number")
        return state.conversations > 0;
      return state.conversations.length > 0;
    },
  },
  actions: {
    async login(uid: string): Promise<CometChat.User | undefined> {
      return CometChatUIKit.init(UIKitSettings)?.then(async () =>
        CometChatUIKit.login(uid),
      );
    },
    async loginAsConcierge(): Promise<CometChat.User | undefined> {
      const conciergeUid = "switchboard-concierge";
      return CometChatUIKit.init(UIKitSettings)?.then(async () =>
        CometChatUIKit.login(conciergeUid),
      );
    },
    async getUnreadMessageCount() {
      return (this.unreadMessages =
        (await CometChat.getUnreadMessageCount()) as UnreadMessages);
    },
    async getConversations() {
      const conversationsRequest = new CometChat.ConversationsRequestBuilder()
        .setLimit(30)
        .build();
      return conversationsRequest.fetchNext().then((conversationList) => {
        this.conversations = conversationList;
      });
    },
  },
});
