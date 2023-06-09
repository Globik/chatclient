import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "./App.vue";
import router from "./router";

import "./assets/index.css";
import "./style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, { timeout: 5000  });

app.mount("#app");
