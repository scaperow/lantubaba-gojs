import colors from 'vuetify/es5/util/colors'
import path from 'path'
import fs from 'fs'

var isProduction = process.env.NODE_ENV === 'production'

var script = []
if (isProduction) {
  script.push(
    {
      hid: 'stripe',
      src: '/analysis.js'
    }
  )
}

export default {
  mode: 'spa',
  router: {
    mode: 'hash',
  },
  layoutTransition: {
    duration: 300,
    name: 'slide-fade',
    mode: 'out-in'
  },
  /* Page Transitions */
  pageTransition: {
    duration: 300,
    name: 'slide-fade',
    mode: 'out-in'
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '蓝图巴巴-%s',
    title: '快捷绘图',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'orange' },
  /*
  ** Global CSS
  */
  css: [
    'animate.css/animate.min.css',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/iconfont.css',
    '~/assets/index.scss'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/validators.js', ssr: false },
    { src: '~/plugins/parse.js', ssr: false },
    { src: '~/plugins/catcher.js', ssr: false },
    { src: '~/plugins/vue-rx.js', ssr: false },
    { src: '~/plugins/vue-filter.js', ssr: false },
    { src: '~/plugins/custom-filters.js', ssr: false },
    { src: '~/plugins/overlay/index.js', ssr: false },
    { src: '~/plugins/nuxt-client-init.client.js', ssr: false },
    
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
    ['@nuxtjs/vuetify', {
      icons: {
        iconfont: 'mdi',
      },
      customVariables: ['~/assets/variables.scss'],
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
            tips: colors.grey.darken4
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
            background: colors.white
          }
        }
      }
    }],
    // With options
    ['@nuxtjs/dotenv', { filename: `${process.env.NODE_ENV}.env` }]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/markdownit',
    'nuxtjs-mdi-font'
  ],

  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    use: [
      'markdown-it-div',
      'markdown-it-attrs'
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
