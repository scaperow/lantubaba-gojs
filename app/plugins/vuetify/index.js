import { defineNuxtPlugin } from "#app";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({ ssr: false });

  app.vueApp.use(vuetify);
});
