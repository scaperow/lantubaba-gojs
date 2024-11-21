// https://v3.nuxtjs.org/api/configuration/nuxt.config
import vuetify from "vite-plugin-vuetify";
export default defineNuxtConfig({
  mode: "spa",
  ssr: false,
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://at.alicdn.com/t/c/font_3846933_8ykbqbjmuc.css",
        },
      ],
    },
  },
  svg: {
    vueSvgLoader: {
      // vue-svg-loader options
    },
    svgSpriteLoader: {
      // svg-sprite-loader options
    },
    fileLoader: {
      // file-loader options
    },
  },
  runtimeConfig: {
    public: {
      baseURL: "http://localhost:8080/",
    },
  },
  css: ["vuetify/lib/styles/main.sass", "@mdi/font/css/materialdesignicons.css", "~/assets/index.scss", "~/assets/settings.scss"],
  build: {
    transpile: ["vuetify"],
    postcss: {
      postcssOptions: require("./postcss.config.js"),
    },
  },
  buildModules: ["@nuxtjs/svg"],
  modules: [
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => config.plugins.push(vuetify({ styles: { configFile: "/assets/settings.scss" } })));
    },
    // "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // automatically imports `defineStore`
          "defineStore", // import { defineStore } from 'pinia'
        ],
      },
    ],
  ],
  routeRules: {
    "/editor": { ssr: false },
  },
});
