import colors from "vuetify/es5/util/colors";

var isProduction = process.env.NODE_ENV === "production";

var script = [];
if (isProduction) {
  script.push({
    hid: "stripe",
    src: "/analysis.js",
  });
}

export default {
  mode: "spa",
  // router: {
  //   mode: 'hash',
  // },

  watchers: {
    webpack: {
      ignored: /node_modules/
    }
  },
  layoutTransition: {
    duration: 300,
    name: "slide-fade",
    mode: "out-in",
  },
  /* Page Transitions */
  pageTransition: {
    duration: 300,
    name: "slide-fade",
    mode: "out-in",
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "蓝图巴巴-%s",
    title: "快捷绘图",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script,
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "blue darken-4" },
  /*
   ** Global CSS
   */
  css: [
    'vuetify/lib/styles/main.sass',
    "animate.css/animate.min.css",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/iconfont.css",
    "~/assets/index.scss",
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~/plugins/validators.js", ssr: false },
    { src: "~/plugins/axios.js", ssr: false },
    { src: "~/plugins/catcher.js", ssr: false },
    { src: "~/plugins/vue-rx.js", ssr: false },
    { src: "~/plugins/vue-filter.js", ssr: false },
    { src: "~/plugins/custom-filters.js", ssr: false },
    { src: "~/plugins/overlay/index.js", ssr: false },
    { src: "~/plugins/nuxt-client-init.client.js", ssr: false },

    // { src: '~/plugins/vue-infinite-loading.js', ssr: false }
    // { src: '~/plugins/vue-dialog.js', ssr: false }
    // { src: '~/plugins/overlays.js', ssr: false },
    // { src: '~/plugins/router.js', ssr: false }
    //{ src: '~/plugins/layer.js', ssr: false },
    // { src: '~/plugins/vuetify-message.js', ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    ["@nuxtjs/vuetify"],
    // With options
    ["@nuxtjs/dotenv", { filename: `${process.env.NODE_ENV}.env` }],
    ["@nuxt/typescript-build"]
  ],
  vuetify: {
    icons: {
      iconfont: "mdi",
    },
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken1,
          accent: colors.teal.lighten1,
          secondary: colors.amber.darken3,
          info: colors.grey.darken3,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          tips: colors.grey.darken4,
        },
        light: {
          primary: colors.blue.darken2,
          accent: colors.teal.lighten1,
          secondary: colors.amber.darken3,
          info: colors.grey.darken3,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          tips: colors.grey.lighten4,
          background: colors.white,
        },
      },
    },
  },
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/markdownit", "@nuxtjs/axios", "nuxtjs-mdi-font"],

  axios: {
    baseURL: "http://localhost:8080",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY3MDc1MTM4ODIzNzczNDgsIm1haWwiOiJzY2FwZXJvd0Bob3RtYWlsLmNvbSIsInNpZ2luQXMiOiJtYWlsIiwiaWF0IjoxNjcwNzU3OTI3fQ.ttdBleEnwVQ-fN6qmDyrMdrrE_iQwj0WTeJQxCkylEY",
    },
  },

  markdownit: {
    preset: "default",
    linkify: true,
    breaks: true,
    use: ["markdown-it-div", "markdown-it-attrs"],
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
