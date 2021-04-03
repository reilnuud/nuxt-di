<template>
  <div class="flex-grow pt-48 w-full overflow-hidden relative">
    <container class="py-12">
      <div />
    </container>
  </div>
</template>

<script>
// import gsap from 'gsap';
export default {
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getSingle('about');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document
      };
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.commit('setTheme', 'dark');
  }
};
</script>
