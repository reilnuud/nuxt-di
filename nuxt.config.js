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
      componentClientOnly: true
    },

    // container name __ + value
    globalName: 'app',

    // PWA manifest
    manifest: {
      short_name: process.env.SITE_NAME,
      name: process.env.SITE_NAME,
      lang: 'en',
      theme_color: '#232222',
      display: 'standalone',
      background_color: '#232222'
    },

    // PWA Options
    workbox: {
      offlinePage: '/offline'
      // Workbox options
    },

    env: {
      PRISMIC_REPO: process.env.PRISMIC_REPO,
      TAILWIND: require('./tailwind.config'),
      SITE_NAME: process.env.SITE_NAME,
      SITE_URL: process.env.SITE_URL,
      SITE_ROUTES: dynamicRoutes,
      SITE_SETTINGS: globalSettings
    },

    /*
     ** Headers of the page
     */
    head: {
      title: process.env.SITE_NAME,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: pkg.description }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
          crossorigin: 'anonymous',
          onLoad: "this.rel='stylesheet'"
        },
        {
          rel: 'preload',
          as: 'style',
          href:"https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,900;1,300;1,400;1,500;1,900&display=swap",
          crossorigin: 'anonymous',
          onLoad: "this.rel='stylesheet'"
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        },
        {
          rel: 'stylesheet',
          href:"https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,900;1,300;1,400;1,500;1,900&display=swap",
        }
      ],
      // remove to allow preloading
      __dangerouslyDisableSanitizers: ['script'],
      htmlAttrs: {
        class: 'h-full w-full relative'
      },
      bodyAttrs: {
        class: 'h-full w-full relative bg-white'
      }
    },

    // fix missing leaflet assets
    alias: {
      './images/layers.png$': path.resolve(
        __dirname,
        '../node_modules/leaflet/dist/images/layers.png'
      ),
      './images/layers-2x.png$': path.resolve(
        __dirname,
        '../node_modules/leaflet/dist/images/layers-2x.png'
      ),
      './images/marker-icon.png$': path.resolve(
        __dirname,
        '../node_modules/leaflet/dist/images/marker-icon.png'
      ),
      './images/marker-icon-2x.png$': path.resolve(
        __dirname,
        '../node_modules/leaflet/dist/images/marker-icon-2x.png'
      ),
      './images/marker-shadow.png$': path.resolve(
        __dirname,
        '../node_modules/leaflet/dist/images/marker-shadow.png'
      )
    },

    // disable loading bar
    loading: false,

    css: ['@/assets/pcss/index.pcss'],

    // plugins
    plugins: [{ src: '@/plugins/global.js' }, { src: '@/plugins/is-dark.js' }],

    // modules
    modules: ['@nuxtjs/axios', '@nuxtjs/pwa', '@nuxtjs/prismic'],

    prismic: {
      endpoint: `https://${process.env.PRISMIC_REPO}.cdn.prismic.io/api/v2`,
      linkResolver: '@/plugins/link-resolver',
      htmlSerializer: '@/plugins/html-serializer'
    },

    // Route Settings
    // server
    router: {
      routeNameSplitter: '/'
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
      crawler: false,
      fallback: '404.html'
    },

    // Default Transition
    pageTransition: {
      name: 'transition--fade',
      mode: 'out-in'
    },

    // axios
    axios: {},

    // server settings
    server: {
      port: 3000, // default: 3000
      host: '0.0.0.0' // default: localhost
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
        plugins: ['@babel/plugin-proposal-optional-chaining']
      },

      // set to false to inline css
      extractCSS: process.env.NODE_ENV !== 'development',

      // postcss config, replaces ./postcss.config.js
      postcss: {
        parser: 'postcss-scss',
        plugins: [
          require('postcss-import')(),
          require('postcss-url')(),
          require('@tailwindcss/postcss7-compat')(),
          require('postcss-normalize')(),
          require('precss')({
            features: {
              'focus-within-pseudo-class': false // Attempt at fixing build error
              // https://github.com/tailwindlabs/tailwindcss/discussions/2462
            }
          }),
          // require('postcss-nested')(),
          require('postcss-preset-env')({
            features: {
              'focus-within-pseudo-class': false // Attempt at fixing build error
              // https://github.com/tailwindlabs/tailwindcss/discussions/2462
            }
          }),
          require('cssnano')(),
          require('postcss-hexrgba')()
        ]
      }
    }
  };
};

export default nuxtSettings;
