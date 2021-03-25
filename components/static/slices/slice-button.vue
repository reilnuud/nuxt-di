<template>
  <div class="flex items-center justify-center">
    <btn :link="primary.link" variant="lg">{{ primary.text }}</btn>
  </div>
</template>

<script>
import PrismicConfig from '~/prismic.config.js';

export default {
  props: PrismicConfig.defaultProps
};
</script>
