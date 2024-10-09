import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";

import { Quasar } from "quasar";

import App from "./App.vue";
import router from "./router";

import { setupI18n } from "./i18n";

const app = createApp(App);

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

const i18n = setupI18n();

app.use(pinia);
app.use(i18n);
app.use(router);
app.use(Quasar);

app.mount("#app");
