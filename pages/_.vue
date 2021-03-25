<template>
  <div class="flex flex-col flex-shrink-0">
    <slices
      v-if="slices && slices.length > 0"
      :key="`slices-${documentId}`"
      :content="slices"
    />
    <h1 v-else class="text-2xl text-center my-auto">{{ title }}</h1>
  </div>
</template>

<script>
import Prismic from 'prismic-javascript';

export default {
  async asyncData({ context, error, req, params }) {
    try {
      const api = await Prismic.getApi(
        `https://${process.env.PRISMIC_REPO}.prismic.io/api/v2`,
        { req }
      );
      // split by / to get uid  or return path if no array after splitting
      const uid =
        params.pathMatch.split('/')[params.pathMatch.split('/').length - 1] ||
        params.pathMatch;
      let document = {};
      const result = await api.getByUID('page', uid);
      document = result.data;
      // Load the edit button
      // if (process.client) window.prismic.setupEditButton()

      return {
        document,
        documentId: result.id,
        title: document.title,
        slices: document.body,
        metaTitle: document.meta_title,
        metaDescription: document.meta_description,
        metaImage: document.meta_image
      };
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  data() {
    return {
      radioTest: '',
      checkBoxTest: false,
      textFieldtest: ''
    };
  },
  computed: {},
  mounted() {},
  methods: {},
  head() {
    return {
      title: this.title,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        { hid: 'title', name: 'title', content: this.metaTitle },
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription
        },
        { hid: 'og:title', name: 'og:title', content: this.metaTitle },

        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDescription
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.metaImage.url || null
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.metaTitle
        },

        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.metaDescription
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.metaImage.url || null
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ]
    };
  }
};
</script>
