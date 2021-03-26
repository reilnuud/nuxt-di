<template>
  <div class="flex-grow w-full overflow-hidden relative">
    About
  </div>
</template>

<script>
import gsap from 'gsap';
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
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.commit('setTheme', 'light');
    setTimeout(() => {
      gsap.to(this.$refs.logomark, { y: 0, opacity: 1, duration: 0.5 });
    }, 500);
  }
};
</script>
