import "./assets/main.css";

import { createApp, ref } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { CometChatTheme, CometChatPalette } from "@cometchat/uikit-resources";
import "@cometchat/chat-uikit-vue/dist/style.css";
import { CometChatUIKit } from "@cometchat/chat-uikit-vue";
import { UIKitSettingsBuilder } from "@cometchat/uikit-shared";

const COMETCHAT_CONSTANTS = {
  APP_ID: import.meta.env.VITE_COMET_CHAT_APP_ID,
  REGION: "us",
  AUTH_KEY: import.meta.env.VITE_COMET_CHAT_AUTH_KEY,
};

export const UIKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForFriends()
  .build();

export const ccTheme = new CometChatTheme({
  palette: new CometChatPalette({
    mode: "light",
  }),
});

CometChatUIKit.init(UIKitSettings)?.then(() => {
  const app = createApp(App);

  const theme = ref(ccTheme);

  app.provide("theme", {
    theme,
  });
  app.use(createPinia());
  app.use(router);

  router.isReady().then(() => {
    app.mount("#app");
  });
}) ?? console.error("CometChat init() failed");
