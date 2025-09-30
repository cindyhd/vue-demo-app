import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuefity from "./plugins/vuefity";
import "@mdi/font/css/materialdesignicons.css";

createApp(App).use(vuefity).use(router).mount("#app");
