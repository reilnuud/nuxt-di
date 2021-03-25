<template>
  <div>
    <container class="my-12">
      <h1>{{ title }}</h1>
    </container>
    <container class="my-12">
      <nuxt-link
        v-for="post in posts"
        :key="post.id"
        class="block my-12"
        :to="`/news/${post.uid}`"
      >
        {{ post.data.title }}
      </nuxt-link>
    </container>
  </div>
</template>

<script>
import Prismic from 'prismic-javascript';
export default {
  async asyncData({ context, error, req, params }) {
    // use nuxt's routing
    try {
      const api = await Prismic.getApi(
        `https://${process.env.PRISMIC_REPO}.prismic.io/api/v2`,
        { req }
      );
      // load posts
      let posts = {};
      const postsQuery = await api.query(
        Prismic.Predicates.at('document.type', 'post')
        // { orderings: '[document.first_publication_date]' }
      );
      posts = postsQuery.results;
      // load page data
      let document = {};
      const result = await api.getSingle('posts_index');
      document = result.data;

      // Load the edit button
      // if (process.client) window.prismic.setupEditButton()

      return {
        posts,
        documentId: result.id,
        title: document.title,
        slices: document.body,
        metaTitle: document.meta_title,
        metaDescription: document.meta_description,
        metaImage: document.meta_image
      };
    } catch (e) {
      console.log(e);
      error({ statusCode: 404, message: 'Page not found' });
    }
  }
};
</script>
