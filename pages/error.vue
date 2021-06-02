<template>
  <div class="flex flex-col flex-grow text-black justify-center">
    <container>
      <h1 class="text-4xl font-light">404</h1>
      <div class="border-b-2 max-w-2xl my-6 border-black" />
      <p class="text-lg">Page not found.</p>
    </container>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('setTheme', { header: 'light', footer: 'light' });
  }
};
</script>
