// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  strapi: {
    cookie: {
      path: '/',
      maxAge: 14 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === 'production',
      sameSite: true
    }
  },

  runtimeConfig: {
    public: {
      strapi: {
        url: process.env.STRAPI_URL || 'http://localhost:1337'
      },
    }
  },

  vite: {
    plugins: [
        tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxt/image',
    '@nuxtjs/strapi'
  ],

  fonts: {
    defaults: {
      weights: [200, 400, 700, 800],
      styles: ['normal']
    },
  },

  image: {
    strapi: {
      baseURL: process.env.STRAPI_URL || 'http://localhost:1337'
    }
  }
})