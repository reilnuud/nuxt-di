<template>
  <div
    class="flex flex-col min-h-screen font-sans transition duration-200"
    :class="{
      'text-purple bg-gray': theme === 'light',
      'text-white bg-purple': theme === 'dark'
    }"
  >
    <app-header />
    <mobile-nav />
    <nuxt class="flex-grow relative z-0" />
    <app-footer />
  </div>
</template>

<script>
export default {
  computed: {
    theme() {
      return this.$store.state.theme;
    }
  }
};
</script>
