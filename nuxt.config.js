import { defineNuxtConfig } from '@nuxt/bridge';

import 'dotenv/config';
// import axios from 'axios'
import path from 'path';
import pkg from './package';
import getRoutes from './getRoutes';
import getGlobalSettings from './getSettings';

const nuxtSettings = async () => {
  const globalSettings = await getGlobalSettings;
  const dynamicRoutes = await getRoutes;

  return {
    // base nuxt config
    target: 'static',

    // features
    features: {
      router: true, // not implemented
      // store: true,
      layouts: true,
      meta: true,
      middleware: true,
      transitions: true,
      deprecations: true,
      validate: true,
      asyncData: true,
      fetch: true,
      clientOnline: true,
      clientPrefetch: true,
      clientUseUrl: false, // this is a bit of an odd one, but using URL should eg be ok for modern mode already
      componentAliases: true,
      componentClientOnly: true,
    },

    // container name __ + value
    globalName: 'app',

    // PWA manifest
    manifest: {
      short_name: process.env.SITE_NAME,
      name: process.env.SITE_NAME,
      lang: 'en',
      theme_color: '#41204d',
      display: 'standalone',
      background_color: '#41204d',
    },

    // // PWA Options
    // workbox: {
    //   offlinePage: '/offline'
    //   // Workbox options
    // },

    env: {
      PRISMIC_REPO: process.env.PRISMIC_REPO,
      TAILWIND: require('./tailwind.config'),
      SITE_NAME: process.env.SITE_NAME,
      SITE_URL: process.env.SITE_URL,
      SITE_ROUTES: dynamicRoutes,
      SITE_SETTINGS: globalSettings,
    },

    /*
     ** Headers of the page
     */
    head: {
      title: process.env.SITE_NAME,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: pkg.description },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
          crossorigin: 'anonymous',
          onLoad: "this.rel='stylesheet'",
        },
        // {
        //   rel: 'preload',
        //   as: 'style',
        //   href: process.env.FONT_CSS,
        //   crossorigin: 'anonymous',
        //   onLoad: "this.rel='stylesheet'"
        // },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        },
        {
          rel: 'stylesheet',
          href: process.env.FONT_CSS,
        },
      ],
      // remove to allow preloading
      __dangerouslyDisableSanitizers: ['script'],
      htmlAttrs: {
        class: 'h-full w-full relative',
      },
      bodyAttrs: {
        class: 'h-full w-full relative bg-white',
      },
    },

    // disable loading bar
    loading: false,

    css: ['@/assets/pcss/index.pcss'],

    // plugins
    plugins: [
      // '@/plugins/processMeta.js',
      { src: '@/plugins/global.js' },
      { src: '@/plugins/is-dark.js' },
      { src: '@/plugins/carousel.js', ssr: false },
    ],

    // modules
    modules: ['@nuxtjs/pwa', '@nuxtjs/prismic'],

    prismic: {
      endpoint: `https://${process.env.PRISMIC_REPO}.cdn.prismic.io/api/v2`,
      preview: '/preview',
      linkResolver: '@/plugins/link-resolver',
      htmlSerializer: '@/plugins/html-serializer',
    },

    // Route Settings
    // server
    router: {
      routeNameSplitter: '/',
      // this breaks the trailing slash url when it should also work
      // trailingSlash: false
    },
    // static site generator
    generate: {
      // just get route values
      routes: dynamicRoutes.map(route => {
        return route[Object.keys(route)[0]];
      }),
      // disable crawler since we're manualy generating routes
      crawler: true,
      fallback: true,
    },

    // Default Transition
    pageTransition: {
      name: 'transition--fade',
      mode: 'out-in',
    },

    // server settings
    server: {
      port: 3000, // default: 3000
      host: '0.0.0.0', // default: localhost
      // https: {
      //   key: fs.readFileSync(path.resolve(__dirname, '.ssl/localhost.key')),
      //   cert: fs.readFileSync(path.resolve(__dirname, '.ssl/localhost.pem'))
      // }
    },

    // build (webpack) config
    build: {
      // optimization
      // parallel: true,
      // cache: true,
      // hardsource: true,

      // needed by prismic
      // extend(config, ctx) {
      //   config.resolve.alias.vue = 'vue/dist/vue.common';
      // },

      babel: {
        plugins: ['@babel/plugin-proposal-optional-chaining'],
      },

      // set to false to inline css
      extractCSS: process.env.NODE_ENV !== 'development',

      // postcss config, replaces ./postcss.config.js
      postcss: {
        plugins: [
          require('postcss-import')(),
          require('tailwindcss/nesting')(),
          require('tailwindcss')(),
          require('postcss-normalize')(),
          require('postcss-preset-env')(),
          require('cssnano')(),
          require('postcss-hexrgba')(),
        ],
      },
    },
  };
};

export default defineNuxtConfig(nuxtSettings());
