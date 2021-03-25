<template>
  <container variant="copy">
    <!-- supporting text -->
    <prismic-rich-text
      v-if="primary.copy !== null"
      class="leading-normala rich-text"
      :richtext="primary.copy"
    />
  </container>
</template>

<script>
import PrismicConfig from '~/prismic.config.js';

export default {
  props: PrismicConfig.defaultProps
  /* to merge the default values, use the below code instead */
  /*
  props: {
    ...defaultProps,
    NEWPROPERTY: {
      type: TYPE
      default: DEFAULT
    }
  }
  */
};
</script>
