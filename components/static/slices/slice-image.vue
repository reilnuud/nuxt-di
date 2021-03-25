<template>
  <div>
    <container
      v-if="primary.layout !== `Full Width`"
      :variant="primary.layout === `Body Width` ? `copy` : `site`"
    >
      <imgix :image="primary.image" />
    </container>
    <imgix v-else :image="primary.image" />
  </div>
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
