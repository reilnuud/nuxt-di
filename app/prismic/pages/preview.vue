<template>
  <div class="flex flex-grow items-center justify-center text-white bg-purple">
    <p class="animate-pulse">Loading preview...</p>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$prismic.preview();
  }
};
</script>
