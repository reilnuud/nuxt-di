<template><div>404</div></template>

<script>
export default {
  mounted() {
    this.$store.commit('setTheme', { header: 'light', footer: 'light' });
  }
};
</script>
