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
        meta: {
          title: document.meta_title,
          description: document.meta_description,
          image: document.meta_image
        }
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
  head() {
    return this.$processMeta(this.title, this.meta, this.$route.path);
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>
