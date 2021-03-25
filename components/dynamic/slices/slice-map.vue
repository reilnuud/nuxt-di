<template>
  <!-- supporting text -->
  <component
    :is="`data-map-${primary.map_type}`"
    v-if="primary.copy !== null"
    :title="primary.map_title"
    :subtitle="primary.map_subtitle"
    :features="primary.features.url"
    :datafiles="items"
    :richtext="primary.copy"
    :scale="primary.node_scale"
    :width="'lg'"
  />
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
