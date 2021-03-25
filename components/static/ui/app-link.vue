<template>
  <nuxt-link v-if="!isOutbound && resolvedLink" :to="resolvedLink">
    <slot />
  </nuxt-link>
  <a
    v-else-if="isOutbound && resolvedLink"
    target="_blank"
    rel="noopener noreferrer"
    :href="resolvedLink"
  >
    <slot />
  </a>
  <button v-else :type="type">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    link: {
      type: Object,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'button'
    }
  },
  computed: {
    isOutbound() {
      const link = this.to || this.link;
      if (link && typeof link === 'string') {
        return link.includes('https://') || link.includes('http://');
      }
      if (link && link.url) {
        return link.url.includes('https://') || link.url.includes('http://');
      }
      return false;
    },
    resolvedLink() {
      return this.$PrismicLink(this.to || this.link);
    }
  }
};
</script>
