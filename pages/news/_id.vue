<template>
  <h1>{{ title }}</h1>
</template>

<script>
import Prismic from 'prismic-javascript';
export default {
  async asyncData({ context, error, req, params }) {
    // use nuxt's routing
    const uid = params.id;
    try {
      const api = await Prismic.getApi(
        `https://${process.env.PRISMIC_REPO}.prismic.io/api/v2`,
        { req }
      );
      let document = {};
      const result = await api.getByUID('post', uid);
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
