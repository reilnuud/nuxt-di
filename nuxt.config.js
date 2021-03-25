import 'dotenv/config'
import axios from 'axios'
import pkg from './package'
// import prismicRoutes from './getRoutes'

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [] // eslint-disable-line no-useless-escape
  }
}

const prismicRef = axios
  .get(`https://${process.env.PRISMIC_REPO}.prismic.io/api/v2`)
  .then(res => {
    return res.data.refs[0].ref
  })

export default {
  mode: 'universal',

  // features
  // ! look here if stuff isn't working
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
    short_name: 'nuxt-rude',
    name: 'nuxt-rude',
    lang: 'en',
    theme_color: '#232222',
    display: 'fullscreen',
    background_color: '#232222'
  },

  // PWA Options
  workbox: {
    offlinePage: '/offline'
    // Workbox options
  },

  env: {
    IMGIX_TOKEN: process.env.IMGIX_TOKEN,
    IMGIX_SUBDOMAIN: process.env.IMGIX_SUBDOMAIN,
    PRISMIC_REPO: process.env.PRISMIC_REPO,
    TAILWIND: require('./tailwind.config')
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'nuxt-rude',
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
        crossorigin: 'anonymous'
      },
      {
        rel: 'preload',
        as: 'style',
        href:
          'https://fonts.googleapis.com/css?family=Barlow:300,300i,400,400i,600,600i,800,800',
        crossorigin: 'anonymous'
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

  // TODO: Doesn't work
  // preload fonts
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  //
  css: ['@/assets/pcss/index.pcss'],

  // plugins
  plugins: [
    { src: '@/plugins/global.js' },
    { src: '@/plugins/link-resolver.js' },
    { src: '@/plugins/html-serializer.js' },
    // { src: '@/plugins/prismic-vue.js' },
    { src: '@/plugins/is-dark.js' }
  ],

  // modules
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-purgecss',
    ['@nuxtjs/google-tag-manager', { id: process.env.GTM_ID }]
  ],

  // ! Apollo Stuff
  // Give apollo module options
  apollo: {
    tokenName: 'yourApolloTokenName', // optional, default: apollo-token
    // cookieAttributes: {
    //   /**
    //    * Define when the cookie will be removed. Value can be a Number
    //    * which will be interpreted as days from time of creation or a
    //    * Date instance. If omitted, the cookie becomes a session cookie.
    //    */
    //   expires: 7, // optional, default: 7 (days)

    //   /**
    //    * Define the path where the cookie is available. Defaults to '/'
    //    */
    //   path: '/', // optional
    //   /**
    //    * Define the domain where the cookie is available. Defaults to
    //    * the domain of the page where the cookie was created.
    //    */
    //   domain: 'example.com', // optional

    //   /**
    //    * A Boolean indicating if the cookie transmission requires a
    //    * secure protocol (https). Defaults to false.
    //    */
    //   secure: false
    // },
    includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
    authenticationType: 'Basic', // optional, default: 'Bearer'
    // (Optional) Default 'apollo' definition
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network'
      }
    },
    // optional
    errorHandler: '~/plugins/apollo-error-handler.js',
    // required
    clientConfigs: {
      default: {
        // required
        httpEndpoint: `https://${process.env.PRISMIC_REPO}.prismic.io/`,
        // optional
        // See https://www.apollographql.com/docs/link/links/http.html#options
        httpLinkOptions: {
          uri: `https://${process.env.PRISMIC_REPO}.prismic.io/graphql`,
          useGETForQueries: true,
          fetchOptions: {
            method: 'GET'
            // headers: {
            //   'Prismic-Ref': prismicRef,
            //   Authorization: `Token ${process.env.PRISMIC_TOKEN}`,
            //   'Content-Type': 'application/json'
            // }
          }
        },
        // You can use `wss` for secure connection (recommended in production)
        // Use `null` to disable subscriptions
        wsEndpoint: null
        // LocalStorage token
        // tokenName: 'apollo-token', // optional
        // Enable Automatic Query persisting with Apollo Engine
        // persisting: false, // Optional
        // Use websockets for everything (no HTTP)
        // You need to pass a `wsEndpoint` for this to work
        // websocketsOnly: false // Optional
      }
      // test: {
      //   httpEndpoint: 'http://localhost:5000',
      //   wsEndpoint: 'ws://localhost:5000',
      //   tokenName: 'apollo-token'
      // }
      // alternative: user path to config which returns exact same config options
      // test2: '~/plugins/alt-config.js'
    }
  },

  // Route Settings
  // server
  router: {
    routeNameSplitter: '/'
  },
  // static site generator
  generate: {
    // routes: () => {
    //   return prismicRoutes
    // }
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
    // push to webpack property
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    },

    // set to false to inline css
    extractCSS: true,

    // postcss config, replaces ./postcss.config.js
    postcss: {
      parser: 'postcss-scss',
      plugins: {
        'postcss-import': {},
        'postcss-url': {},
        tailwindcss: './tailwind.config.js',
        'postcss-normalize': {},
        precss: {},
        'postcss-nested': {},
        'postcss-preset-env': {},
        cssnano: {},
        'postcss-hexrgba': {}
      },
      order: [
        'postcss-import',
        'postcss-url',
        'tailwindcss',
        'postcss-normalize',
        'precss',
        'postcss-nested',
        'postcss-preset-env',
        'cssnano',
        'postcss-hexrgba'
      ]
    }

    // not working
    // purgecss: {
    //   whitelist: ['body', 'html'],
    //   whitelistPatterns: [/\^transition--.*/],
    //   extractors: [
    //     {
    //       extractor: TailwindExtractor,
    //       extensions: ['vue', 'js', 'html']
    //     }
    //   ]
    // }
  }
}
