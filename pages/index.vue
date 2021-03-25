<template>
  <div class="flex-grow">
    <div v-for="slide in carousel" :key="slide.uid">
      {{ slide.heading }}
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getSingle('home_page');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        slices: document.body,
        install: false,
        carousel: document.full_page_carousel.map(slide => {
          return {
            uid: slide.uid,
            heading: slide.heading,
            image: slide.image
          };
        })
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
