// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    'nuxt-aos',
    '@nuxt/image',
    '@nuxt/scripts'
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-P2ZZCPEEF6',
      }
    }
  }
})