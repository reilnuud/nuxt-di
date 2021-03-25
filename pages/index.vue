<template>
  <install v-if="install" />
  <div v-else>
    <slices
      v-if="slices && slices.length > 0"
      :key="`slices-${id}`"
      :content="slices"
    />
  </div>
</template>

<script>
export default {
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getSingle('home');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        slices: document.body,
        install: false
      };
    } catch (e) {
      // error({ statusCode: 404, message: 'Page not found' })
      return {
        install: true
      };
    }
  },
  data() {
    return {
      install: false
    };
  }
};
</script>
